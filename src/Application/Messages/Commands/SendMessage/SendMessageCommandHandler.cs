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
        : ICommandHandler<SendMessageCommand, List<Application.DTOs.Messages.MessageDto>>
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

            var hasFiles = request.Files?.Any() == true;
            var messageType = hasFiles ? MessageType.Attachment : MessageType.Text;

            // Upload the first file only (one message = one attachment)
            (string Url, string ContentType, long Size)? uploadedFile = null;
            if (hasFiles)
            {
                var file = request.Files!.First();
                string fileUrl;
                if (file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
                {
                    fileUrl = await _uploadService.UploadImageAsync(file.Stream, file.FileName);
                }
                else if (file.ContentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase))
                {
                    var result = await _uploadService.UploadVideoWithMetadataAsync(file.Stream, file.FileName);
                    fileUrl = result.VideoUrl;
                }
                else
                {
                    fileUrl = await _uploadService.UploadFileAsync(file.Stream, file.FileName);
                }
                uploadedFile = (fileUrl, file.ContentType, file.FileSize);
            }

            // Create a single message
            var message = new Message(0, conversation.Id, request.SenderId, request.Content);
            message.SetMessageType(messageType);

            if (uploadedFile.HasValue)
            {
                var (url, contentType, size) = uploadedFile.Value;
                var attachment = new MessageAttachment(0, message.Id, url, contentType, size);
                message.AttachFile(attachment);
            }

            _messageRepository.Add(message);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Re-fetch with full includes for DTO mapping
            var reloaded = await _messageRepository.GetByIdWithIncludesAsync(message.Id, cancellationToken);
            return Result.Success(new List<MessageDto> { MessageDto.FromDomain(reloaded!) });
        }
    }
}
