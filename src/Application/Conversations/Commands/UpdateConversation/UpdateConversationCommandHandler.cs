using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Abstractions.SignalR;
using Application.DTOs.Conversations;
using Application.DTOs.Messages;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;
using System.Text.Json;

namespace Application.Conversations.Commands.UpdateConversation;

internal sealed class UpdateConversationCommandHandler
    : ICommandHandler<UpdateConversationCommand, ConversationDetailDto>
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IMessageRepository _messageRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IChatHubNotifier _hubNotifier;

    public UpdateConversationCommandHandler(
        IConversationRepository conversationRepository,
        IMessageRepository messageRepository,
        IUnitOfWork unitOfWork,
        IChatHubNotifier hubNotifier)
    {
        _conversationRepository = conversationRepository;
        _messageRepository = messageRepository;
        _unitOfWork = unitOfWork;
        _hubNotifier = hubNotifier;
    }

    public async Task<Result<ConversationDetailDto>> Handle(
        UpdateConversationCommand request,
        CancellationToken cancellationToken)
    {
        var conversation = await _conversationRepository.GetByIdAsync(
            request.ConversationId, cancellationToken);

        if (conversation is null)
        {
            return Result.Failure<ConversationDetailDto>(
                new Error("Conversation.NotFound", "Conversation not found."));
        }

        var member = conversation.Members.FirstOrDefault(m => m.UserId == request.RequesterId);
        if (member is null)
        {
            return Result.Failure<ConversationDetailDto>(
                new Error("Conversation.NotMember", "You are not a member of this conversation."));
        }

        var oldName = conversation.Name;
        var oldTheme = conversation.Theme;
        var oldDefaultReaction = conversation.DefaultReaction;

        var updateResult = conversation.UpdateConversation(
            request.RequesterId,
            request.Name,
            request.Theme,
            request.DefaultReaction);

        if (updateResult.IsFailure)
            return Result.Failure<ConversationDetailDto>(updateResult.Error);

        var systemMessages = CreateSystemMessages(
            request.ConversationId,
            request.RequesterId,
            oldName, conversation.Name,
            oldTheme, conversation.Theme,
            oldDefaultReaction, conversation.DefaultReaction);

        foreach (var msg in systemMessages)
            _messageRepository.Add(msg);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var updated = await _conversationRepository.GetByIdAsync(
            request.ConversationId, cancellationToken);

        var dto = ConversationDetailDto.FromDomain(updated!, request.RequesterId);

        await _hubNotifier.NotifyConversationUpdatedAsync(
            request.ConversationId,
            dto,
            cancellationToken);

        foreach (var msg in systemMessages)
        {
            var reloaded = await _messageRepository.GetByIdWithIncludesAsync(msg.Id, cancellationToken);
            if (reloaded is not null)
            {
                var msgDto = MessageDto.FromDomain(reloaded);
                await _hubNotifier.NotifySystemMessageSentAsync(request.ConversationId, msgDto, cancellationToken);
            }
        }

        return dto;
    }

    private static List<Message> CreateSystemMessages(
        long conversationId,
        Guid creatorId,
        string? oldName, string? newName,
        string? oldTheme, string? newTheme,
        string? oldReaction, string? newReaction)
    {
        var messages = new List<Message>();

        if (oldName != newName && !string.IsNullOrWhiteSpace(newName))
        {
            var payload = JsonSerializer.Serialize(new { oldValue = oldName ?? "", newValue = newName });
            messages.Add(CreateSystemMessage(conversationId, creatorId, SystemMessageType.ConversationNameUpdated, payload));
        }

        if (oldTheme != newTheme)
        {
            var payload = JsonSerializer.Serialize(new { oldValue = oldTheme ?? "", newValue = newTheme ?? "" });
            messages.Add(CreateSystemMessage(conversationId, creatorId, SystemMessageType.ConversationThemeUpdated, payload));
        }

        if (oldReaction != newReaction)
        {
            var payload = JsonSerializer.Serialize(new { oldValue = oldReaction ?? "", newValue = newReaction ?? "" });
            messages.Add(CreateSystemMessage(conversationId, creatorId, SystemMessageType.ConversationDefaultReactionUpdated, payload));
        }

        return messages;
    }

    private static Message CreateSystemMessage(long conversationId, Guid creatorId, SystemMessageType type, string? payload)
    {
        var msg = new Message(0, conversationId, creatorId, null);
        msg.SetAsSystemMessage(type, payload);
        msg.SetMessageType(MessageType.Text);
        return msg;
    }
}
