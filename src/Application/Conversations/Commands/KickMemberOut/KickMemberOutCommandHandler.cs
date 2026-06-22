using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Abstractions.SignalR;
using Application.DTOs.Messages;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;
using System.Text.Json;

namespace Application.Conversations.Commands.KickMemberOut;

internal sealed class KickMemberOutCommandHandler
    : ICommandHandler<KickMemberOutCommand>
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IMessageRepository _messageRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IChatHubNotifier _hubNotifier;
    private readonly IUserRepository _userRepository;

    public KickMemberOutCommandHandler(
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

    public async Task<Result> Handle(KickMemberOutCommand request, CancellationToken cancellationToken)
    {
        var conversation = await _conversationRepository.GetByIdAsync(request.ConversationId, cancellationToken);
        if (conversation is null)
        {
            return Result.Failure(new Error("Conversation.NotFound", "Conversation not found"));
        }

        var result = conversation.KickMemberOut(request.RequesterId, request.UserIdToKick);
        if (result.IsFailure) return result;

        var removedUser = await _userRepository.GetByIdAsync(request.UserIdToKick, cancellationToken);
        var removedUserName = $"{removedUser?.FirstName} {removedUser?.LastName}";

        var payload = JsonSerializer.Serialize(new { removedUserName });
        var systemMessage = CreateSystemMessage(
            request.ConversationId,
            request.RequesterId,
            SystemMessageType.MemberRemoved,
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
