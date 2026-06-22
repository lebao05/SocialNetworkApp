using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Abstractions.SignalR;
using Application.DTOs.Messages;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;
using System.Text.Json;

namespace Application.Conversations.Commands.LeaveConversation;

internal sealed class LeaveConversationCommandHandler
    : ICommandHandler<LeaveConversationCommand>
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IMessageRepository _messageRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IChatHubNotifier _hubNotifier;
    private readonly IUserRepository _userRepository;

    public LeaveConversationCommandHandler(
        IConversationRepository conversationRepository,
        IMessageRepository messageRepository,
        IUnitOfWork unitOfWork,
        IChatHubNotifier hubNotifier,
        IUserRepository userRepository)
    {
        _conversationRepository = conversationRepository;
        _messageRepository = messageRepository;
        _unitOfWork = unitOfWork;
        _hubNotifier = hubNotifier;
        _userRepository = userRepository;
    }

    public async Task<Result> Handle(LeaveConversationCommand request, CancellationToken cancellationToken)
    {
        var conversation = await _conversationRepository.GetByIdAsync(request.ConversationId, cancellationToken);
        if (conversation is null)
        {
            return Result.Failure(new Error("Conversation.NotFound", "Conversation not found"));
        }

        var result = conversation.Leave(request.UserId);
        if (result.IsFailure) return result;

        var leavingUser = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        var leftUserName = $"{leavingUser?.FirstName} {leavingUser?.LastName}";

        var payload = JsonSerializer.Serialize(new { leftUserName });
        var systemMessage = CreateSystemMessage(
            request.ConversationId,
            request.UserId,
            SystemMessageType.MemberLeft,
            payload);
        _messageRepository.Add(systemMessage);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var reloaded = await _messageRepository.GetByIdWithIncludesAsync(systemMessage.Id, cancellationToken);
        if (reloaded is not null)
        {
            var msgDto = MessageDto.FromDomain(reloaded);
            await _hubNotifier.NotifySystemMessageSentAsync(request.ConversationId, msgDto, cancellationToken);
        }

        return Result.Success();
    }

    private static Message CreateSystemMessage(long conversationId, Guid creatorId, SystemMessageType type, string? payload)
    {
        var msg = new Message(0, conversationId, creatorId, null);
        msg.SetAsSystemMessage(type, payload);
        msg.SetMessageType(MessageType.Text);
        return msg;
    }
}
