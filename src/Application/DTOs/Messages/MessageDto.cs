namespace Application.DTOs.Messages;

public sealed record MessageDto(
    long Id,
    long ConversationId,
    Guid SenderId,
    string SenderName,
    string? SenderAvatarUrl,
    string? Content,
    string MessageType,
    DateTime CreatedAt,
    bool IsPinned,
    List<MessageReactionDto> Reactions,
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
            MessageType: message.MessageType.ToString(),
            CreatedAt: message.CreatedAt,
            IsPinned: message.IsPinned,
            Reactions: message.Reactions.Select(MessageReactionDto.FromDomain).ToList(),
            Attachment: AttachmentDto.FromDomain(message.Attachment),
            ForwardFromMessageId: message.ForwardFromMessageId
        );
    }
}
