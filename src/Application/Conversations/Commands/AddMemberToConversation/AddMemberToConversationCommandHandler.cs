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

namespace Application.Conversations.Commands.AddMemberToConversation;

internal sealed class AddMemberToConversationCommandHandler
    : ICommandHandler<AddMemberToConversationCommand, ConversationMemberDto>
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IMessageRepository _messageRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IChatHubNotifier _hubNotifier;
    private readonly IPresenceTracker _presenceTracker;
    private readonly IUserRepository _userRepository;

    public AddMemberToConversationCommandHandler(
        IConversationRepository conversationRepository,
        IMessageRepository messageRepository,
        IUnitOfWork unitOfWork,
        IChatHubNotifier hubNotifier,
        IPresenceTracker presenceTracker,
        IUserRepository userRepository)
    {
        _conversationRepository = conversationRepository;
        _messageRepository = messageRepository;
        _unitOfWork = unitOfWork;
        _hubNotifier = hubNotifier;
        _presenceTracker = presenceTracker;
        _userRepository = userRepository;
    }

    public async Task<Result<ConversationMemberDto>> Handle(
        AddMemberToConversationCommand request,
        CancellationToken cancellationToken)
    {
        var conversation = await _conversationRepository
            .GetByIdAsync(request.ConversationId, cancellationToken);

        if (conversation is null)
        {
            return Result.Failure<ConversationMemberDto>(
                new Error("Conversation.NotFound", "Conversation not found"));
        }

        if (conversation.IsOneToOne)
        {
            return Result.Failure<ConversationMemberDto>(
                new Error("Conversation.InvalidOperation", "Cannot add members to a one-to-one conversation."));
        }

        var result = conversation.AddMember(request.UserIdToAdd, ConversationRole.Member);

        if (result.IsFailure)
        {
            return Result.Failure<ConversationMemberDto>(result.Error);
        }

        var newMember = await _userRepository.GetByIdAsync(request.UserIdToAdd, cancellationToken);
        var newMemberUserName = $"{newMember?.FirstName} {newMember?.LastName}";

        var payload = JsonSerializer.Serialize(new { newMemberUserName });
        var systemMessage = CreateSystemMessage(
            request.ConversationId,
            request.AdminId,
            SystemMessageType.MemberAdded,
            payload);
        _messageRepository.Add(systemMessage);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Reload the member with User navigation property populated
        var updatedMember = await _conversationRepository
            .GetMemberAsync(request.ConversationId, request.UserIdToAdd, cancellationToken);

        if (updatedMember is null)
        {
            return Result.Failure<ConversationMemberDto>(
                new Error("Conversation.MemberNotFound", "Could not load the newly added member."));
        }

        var memberDto = ConversationMemberDto.FromDomain(updatedMember);

        // Notify all existing members via SignalR
        var existingMemberIds = conversation.Members
            .Select(m => m.UserId)
            .ToList();

        await _hubNotifier.NotifyMemberAddedAsync(
            request.ConversationId,
            memberDto,
            existingMemberIds,
            cancellationToken);

        // Add the new member's connections to the SignalR group
        await _hubNotifier.AddConnectionsToGroupAsync(
            request.ConversationId,
            new List<Guid> { request.UserIdToAdd},
            cancellationToken);

        var reloaded = await _messageRepository.GetByIdWithIncludesAsync(systemMessage.Id, cancellationToken);
        if (reloaded is not null)
        {
            var msgDto = MessageDto.FromDomain(reloaded);
            await _hubNotifier.NotifySystemMessageSentAsync(request.ConversationId, msgDto, cancellationToken);
        }

        return Result.Success(memberDto);
    }

    private static Message CreateSystemMessage(long conversationId, Guid creatorId, SystemMessageType type, string? payload)
    {
        var msg = new Message(0, conversationId, creatorId, null);
        msg.SetAsSystemMessage(type, payload);
        msg.SetMessageType(MessageType.Text);
        return msg;
    }
}
