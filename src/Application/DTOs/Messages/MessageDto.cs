using Domain.Enums;

namespace Application.DTOs.Messages
{
    public sealed record MessageDto(
        long Id,
        long ConversationId,
        Guid SenderId,
        string SenderName,
        string? SenderAvatarUrl,
        string? Content,
        DateTime CreatedAt,
        MessageType MessageType,
        bool IsPinned,
        string? Reaction,
        Guid? ReactionUserId,
        AttachmentDto? Attachment,
        long? ForwardFromMessageId
    )
    {
        public static MessageDto FromDomain(Domain.Entities.Message message)
        {
            return new MessageDto(
                Id: message.Id,
                ConversationId: message.ConversationId,
                SenderId: message.CreatorId,
                SenderName: $"{message.Creator.FirstName} {message.Creator.LastName}",
                SenderAvatarUrl: message.Creator.AvatarUrl,
                Content: message.Content,
                CreatedAt: message.CreatedAt,
                MessageType: message.MessageType,
                IsPinned: message.IsPinned,
                Reaction: message.Reaction,
                ReactionUserId: message.ReactionUserId,

                Attachment: AttachmentDto.FromDomain(message.Attachment),

                ForwardFromMessageId: message.ForwardFromMessageId
            );
        }
    }
}
