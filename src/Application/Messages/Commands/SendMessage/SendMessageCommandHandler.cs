using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Messages;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;

namespace Application.Messages.Commands.SendMessage
{
    internal sealed class SendMessageCommandHandler
        : ICommandHandler<SendMessageCommand, List<MessageDto>>
    {
        private readonly IConversationRepository _conversationRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IUploadService _uploadService;
        private readonly IUnitOfWork _unitOfWork;

        public SendMessageCommandHandler(
            IMessageRepository messageRepository,
            IConversationRepository conversationRepository,
            IUploadService uploadService,
            IUnitOfWork unitOfWork)
        {
            _messageRepository = messageRepository;
            _conversationRepository = conversationRepository;
            _uploadService = uploadService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<List<MessageDto>>> Handle(
            SendMessageCommand request,
            CancellationToken cancellationToken)
        {
            var conversation = await _conversationRepository.GetByIdAsync(request.ConversationId, cancellationToken);

            if (conversation is null)
            {
                return Result.Failure<List<MessageDto>>(new Error("Conversation.NotFound", "Conversation not found"));
            }

            var senderMember = conversation.Members.FirstOrDefault(m => m.UserId == request.SenderId);
            if (senderMember is null)
            {
                return Result.Failure<List<MessageDto>>(new Error("Conversation.Forbidden", "You are not a member of this conversation"));
            }

            var createdMessages = new List<Message>();

            // 1. Text message (if content provided)
            if (!string.IsNullOrWhiteSpace(request.Content))
            {
                var textMessage = CreateMessage(conversation.Id, request.SenderId, request.Content);
                createdMessages.Add(textMessage);
            }

            // 2. File messages (one per file, separate messages)
            if (request.Files?.Any() == true)
            {
                foreach (var file in request.Files)
                {
                    var fileMessage = await CreateFileMessageAsync(conversation.Id, request.SenderId, file, cancellationToken);
                    createdMessages.Add(fileMessage);
                }
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Re-fetch with full includes for DTO mapping
            var resultDtos = new List<MessageDto>();
            foreach (var msg in createdMessages)
            {
                var reloaded = await _messageRepository.GetByIdWithIncludesAsync(msg.Id, cancellationToken);
                if (reloaded != null)
                    resultDtos.Add(MessageDto.FromDomain(reloaded));
            }

            return Result.Success(resultDtos);
        }

        private Message CreateMessage(long conversationId, Guid senderId, string? content)
        {
            var message = new Message(0, conversationId, senderId, content);
            _messageRepository.Add(message);
            return message;
        }

        private async Task<Message> CreateFileMessageAsync(
            long conversationId,
            Guid senderId,
            SendMessageFile file,
            CancellationToken cancellationToken)
        {
            var message = new Message(0, conversationId, senderId, null);
            var messageType = InferMessageType(file.ContentType);
            message.SetMessageType(messageType);

            string fileUrl;
            if (messageType == MessageType.Image)
            {
                fileUrl = await _uploadService.UploadImageAsync(file.Stream, file.FileName);
            }
            else if (messageType == MessageType.Video)
            {
                var result = await _uploadService.UploadVideoWithMetadataAsync(file.Stream, file.FileName);
                fileUrl = result.VideoUrl;
            }
            else
            {
                fileUrl = await _uploadService.UploadFileAsync(file.Stream, file.FileName);
            }

            var attachment = new MessageAttachment(0, message.Id, fileUrl, file.ContentType, file.FileSize);
            message.AttachFile(attachment);

            _messageRepository.Add(message);

            return message;
        }

        private static MessageType InferMessageType(string contentType)
        {
            if (string.IsNullOrEmpty(contentType)) return MessageType.File;

            var lower = contentType.ToLowerInvariant();
            if (lower.StartsWith("image/")) return MessageType.Image;
            if (lower.StartsWith("video/")) return MessageType.Video;
            if (lower.StartsWith("audio/")) return MessageType.Audio;

            return MessageType.File;
        }
    }
}
