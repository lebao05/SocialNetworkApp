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

namespace Application.Conversations.Commands.UploadConversationImage;

internal sealed class UploadConversationImageCommandHandler
    : ICommandHandler<UploadConversationImageCommand, string>
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IMessageRepository _messageRepository;
    private readonly IUploadService _uploadService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IChatHubNotifier _hubNotifier;

    public UploadConversationImageCommandHandler(
        IConversationRepository conversationRepository,
        IMessageRepository messageRepository,
        IUploadService uploadService,
        IUnitOfWork unitOfWork,
        IChatHubNotifier hubNotifier)
    {
        _conversationRepository = conversationRepository;
        _messageRepository = messageRepository;
        _uploadService = uploadService;
        _unitOfWork = unitOfWork;
        _hubNotifier = hubNotifier;
    }

    public async Task<Result<string>> Handle(
        UploadConversationImageCommand request,
        CancellationToken cancellationToken)
    {
        var conversation = await _conversationRepository.GetByIdAsync(
            request.ConversationId, cancellationToken);

        if (conversation is null)
        {
            return Result.Failure<string>(new Error(
                "Conversation.NotFound",
                $"The conversation with Id {request.ConversationId} was not found."));
        }

        var member = conversation.Members.FirstOrDefault(m => m.UserId == request.RequesterId);
        if (member is null)
        {
            return Result.Failure<string>(new Error(
                "Conversation.NotMember",
                "You are not a member of this conversation."));
        }

        try
        {
            var oldImageUrl = conversation.ImageUrl;
            var imageUrl = await _uploadService.UploadImageAsync(
                request.FileStream, request.FileName);

            conversation.SetImageUrl(imageUrl);

            var payload = JsonSerializer.Serialize(new { oldValue = oldImageUrl ?? "", newValue = imageUrl });
            var systemMessage = CreateSystemMessage(
                request.ConversationId,
                request.RequesterId,
                SystemMessageType.ConversationImageUpdated,
                payload);
            _messageRepository.Add(systemMessage);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var updated = await _conversationRepository.GetByIdAsync(
                request.ConversationId, cancellationToken);

            var dto = ConversationDetailDto.FromDomain(updated!, request.RequesterId);

            await _hubNotifier.NotifyConversationUpdatedAsync(
                request.ConversationId,
                dto,
                cancellationToken);

            var reloaded = await _messageRepository.GetByIdWithIncludesAsync(systemMessage.Id, cancellationToken);
            if (reloaded is not null)
            {
                var msgDto = MessageDto.FromDomain(reloaded);
                await _hubNotifier.NotifySystemMessageSentAsync(request.ConversationId, msgDto, cancellationToken);
            }

            return Result.Success(imageUrl);
        }
        catch (Exception ex)
        {
            return Result.Failure<string>(new Error(
                "ConversationImage.UploadFailed",
                ex.Message));
        }
    }

    private static Message CreateSystemMessage(long conversationId, Guid creatorId, SystemMessageType type, string? payload)
    {
        var msg = new Message(0, conversationId, creatorId, null);
        msg.SetAsSystemMessage(type, payload);
        msg.SetMessageType(MessageType.Text);
        return msg;
    }
}
