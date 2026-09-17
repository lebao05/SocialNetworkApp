using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Abstractions.SignalR;
using Application.DTOs.Messages;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;

namespace Application.Messages.Commands.SendMessage
{
    internal sealed class SendMessageCommandHandler
        : ICommandHandler<SendMessageCommand, List<Application.DTOs.Messages.MessageDto>>
    {
        private readonly IConversationRepository _conversationRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IUploadService _uploadService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IChatHubNotifier _chatHubNotifier;

        // Allowed document file extensions (max 20MB per file)
        private static readonly HashSet<string> AllowedDocumentExtensions = new(StringComparer.OrdinalIgnoreCase)
        {
            ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
            ".txt", ".csv", ".zip", ".rar", ".7z"
        };

        private const long MaxDocumentSizeBytes = 20 * 1024 * 1024; // 20MB
        private const long MaxImageSizeBytes = 10 * 1024 * 1024; // 10MB
        private const long MaxVideoSizeBytes = 100 * 1024 * 1024; // 100MB

        public SendMessageCommandHandler(
            IMessageRepository messageRepository,
            IConversationRepository conversationRepository,
            IUploadService uploadService,
            IUnitOfWork unitOfWork,
            IChatHubNotifier chatHubNotifier)
        {
            _messageRepository = messageRepository;
            _conversationRepository = conversationRepository;
            _uploadService = uploadService;
            _unitOfWork = unitOfWork;
            _chatHubNotifier = chatHubNotifier;
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

            // Validate and upload files - one message per file
            if (request.Files?.Any() == true)
            {
                foreach (var file in request.Files)
                {
                    // Validate file type and size
                    var validationResult = ValidateFile(file);
                    if (validationResult.IsFailure)
                    {
                        return Result.Failure<List<MessageDto>>(validationResult.Error);
                    }

                    // Upload file based on type
                    string fileUrl;
                    var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

                    if (file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
                    {
                        fileUrl = await _uploadService.UploadImageAsync(file.Stream, file.FileName);
                    }
                    else if (file.ContentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase) ||
                             file.ContentType.StartsWith("audio/", StringComparison.OrdinalIgnoreCase))
                    {
                        var result = await _uploadService.UploadVideoWithMetadataAsync(file.Stream, file.FileName);
                        fileUrl = result.VideoUrl;
                    }
                    else
                    {
                        // Document or other file type
                        fileUrl = await _uploadService.UploadFileAsync(file.Stream, file.FileName);
                    }

                    // Create message for this attachment
                    var fileMessage = new Message(0, conversation.Id, request.SenderId, null);
                    fileMessage.SetMessageType(MessageType.Attachment);

                    if (request.RepliedMessageId.HasValue)
                    {
                        fileMessage.SetReplyTo(request.RepliedMessageId.Value);
                    }

                    var attachment = new MessageAttachment(0, fileMessage.Id, fileUrl, file.ContentType, file.FileSize);
                    fileMessage.AttachFile(attachment);

                    _messageRepository.Add(fileMessage);
                    createdMessages.Add(fileMessage);
                }
            }

            // Create text message if content is provided
            if (!string.IsNullOrWhiteSpace(request.Content))
            {
                var textMessage = new Message(0, conversation.Id, request.SenderId, request.Content);
                textMessage.SetMessageType(MessageType.Text);

                if (request.RepliedMessageId.HasValue)
                {
                    textMessage.SetReplyTo(request.RepliedMessageId.Value);
                }

                _messageRepository.Add(textMessage);
                createdMessages.Add(textMessage);
            }

            // If no content and no files, return error
            if (createdMessages.Count == 0)
            {
                return Result.Failure<List<MessageDto>>(new Error("Message.Empty", "Message must have content or attachments"));
            }

            // Save all messages to database
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Re-fetch all messages with full includes for DTO mapping
            var messageDtos = new List<MessageDto>();
            foreach (var msg in createdMessages)
            {
                var reloaded = await _messageRepository.GetByIdWithIncludesAsync(msg.Id, cancellationToken);

                // Ensure ReplyToMessage is loaded
                if (reloaded!.ReplyToMessage is null && request.RepliedMessageId.HasValue)
                {
                    var replyTarget = await _messageRepository.GetByIdAsync(request.RepliedMessageId.Value, cancellationToken);
                    if (replyTarget is not null)
                    {
                        reloaded.GetType().GetProperty("ReplyToMessage")!.SetValue(reloaded, replyTarget);
                    }
                }

                messageDtos.Add(MessageDto.FromDomain(reloaded!));
            }

            // Send all messages via SignalR
            await _chatHubNotifier.NotifyMessagesSentAsync(conversation.Id, messageDtos, cancellationToken);

            return Result.Success(messageDtos);
        }

        private Result ValidateFile(SendMessageFile file)
        {
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            // Check if it's an image
            if (file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
            {
                if (file.FileSize > MaxImageSizeBytes)
                {
                    return Result.Failure(new Error("File.TooLarge", $"Image file size must not exceed {MaxImageSizeBytes / 1024 / 1024}MB"));
                }
                return Result.Success();
            }

            // Check if it's a video or audio
            if (file.ContentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase) ||
                file.ContentType.StartsWith("audio/", StringComparison.OrdinalIgnoreCase))
            {
                if (file.FileSize > MaxVideoSizeBytes)
                {
                    return Result.Failure(new Error("File.TooLarge", $"Video/Audio file size must not exceed {MaxVideoSizeBytes / 1024 / 1024}MB"));
                }
                return Result.Success();
            }

            // Check if it's an allowed document
            if (AllowedDocumentExtensions.Contains(extension))
            {
                if (file.FileSize > MaxDocumentSizeBytes)
                {
                    return Result.Failure(new Error("File.TooLarge", $"Document file size must not exceed {MaxDocumentSizeBytes / 1024 / 1024}MB"));
                }
                return Result.Success();
            }

            // File type not allowed
            return Result.Failure(new Error("File.NotAllowed", $"File type '{extension}' is not allowed. Allowed types: images, videos, audio, and documents (pdf, doc, docx, xls, xlsx, ppt, pptx, txt, csv, zip, rar, 7z)"));
        }
    }
}
