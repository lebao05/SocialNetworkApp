using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Messages;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;
using Microsoft.Extensions.Logging;

namespace Application.Messages.Commands.SendMessage
{
    internal sealed class SendMessageCommandHandler
        : ICommandHandler<SendMessageCommand, List<MessageDto>>
    {
        private readonly IConversationRepository _conversationRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IUploadService _uploadService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<SendMessageCommandHandler> _logger;

        public SendMessageCommandHandler(
            IMessageRepository messageRepository,
            IConversationRepository conversationRepository,
            IUploadService uploadService,
            IUnitOfWork unitOfWork,
            ILogger<SendMessageCommandHandler> logger)
        {
            _messageRepository = messageRepository;
            _conversationRepository = conversationRepository;
            _uploadService = uploadService;
            _unitOfWork = unitOfWork;
            _logger = logger;
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

            var createdMessages = new List<MessageDto>();

            // 1. Text-only message (if content is provided)
            if (!string.IsNullOrWhiteSpace(request.Content))
            {
                var textMessage = new Message(
                    id: 0,
                    conversationId: conversation.Id,
                    senderId: request.SenderId,
                    content: request.Content);

                textMessage.SetMessageType(MessageType.Normal);
                _messageRepository.Add(textMessage);
                createdMessages.Add(MessageDto.FromDomain(textMessage));
            }

            // 2. File messages (one per file, separate from text)
            if (request.Files is not null && request.Files.Count > 0)
            {
                foreach (var file in request.Files)
                {
                    string fileUrl;
                    string? thumbnailUrl = null;
                    string? duration = null;

                    try
                    {
                        (fileUrl, thumbnailUrl, duration) = await UploadFileAsync(file, cancellationToken);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to upload file {FileName} for conversation {ConversationId}",
                            file.FileName, conversation.Id);
                        return Result.Failure<List<MessageDto>>(new Error("File.UploadFailed",
                            $"Failed to upload file: {file.FileName}"));
                    }

                    var fileMessage = new Message(
                        id: 0,
                        conversationId: conversation.Id,
                        senderId: request.SenderId,
                        content: null);

                    var messageType = InferMessageType(file.FileType);
                    fileMessage.SetMessageType(messageType);

                    var attachment = new MessageAttachment(
                        id: 0,
                        messageId: 0,
                        fileUrl: fileUrl,
                        fileType: file.FileType,
                        fileSize: file.FileSize);

                    if (!string.IsNullOrEmpty(thumbnailUrl))
                    {
                        fileMessage.SetPayload(thumbnailUrl);
                    }

                    fileMessage.AttachFile(attachment);
                    _messageRepository.Add(fileMessage);
                    createdMessages.Add(MessageDto.FromDomain(fileMessage));
                }
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(createdMessages);
        }

        private async Task<(string FileUrl, string? ThumbnailUrl, string? Duration)> UploadFileAsync(
            SendMessageFile file,
            CancellationToken cancellationToken)
        {
            var fileTypeLower = file.FileType.ToLowerInvariant();

            if (fileTypeLower.StartsWith("image/"))
            {
                var url = await _uploadService.UploadImageAsync(file.Stream, file.FileName);
                return (url, null, null);
            }

            if (fileTypeLower.StartsWith("video/"))
            {
                var result = await _uploadService.UploadVideoWithMetadataAsync(file.Stream, file.FileName);
                return (result.VideoUrl, result.ThumbnailUrl, result.Duration);
            }

            // Audio and other file types
            var genericUrl = await _uploadService.UploadFileAsync(file.Stream, file.FileName);
            return (genericUrl, null, null);
        }

        private MessageType InferMessageType(string fileType)
        {
            var type = fileType.ToLowerInvariant();

            if (type.StartsWith("image/")) return MessageType.Image;
            if (type.StartsWith("video/")) return MessageType.Video;
            if (type.StartsWith("audio/")) return MessageType.Audio;

            return MessageType.File;
        }
    }
}
