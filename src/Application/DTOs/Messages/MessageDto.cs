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
        var creator = message.Creator;
        return new MessageDto(
            Id: message.Id,
            ConversationId: message.ConversationId,
            SenderId: message.CreatorId,
            SenderName: creator is not null ? $"{creator.FirstName} {creator.LastName}" : "Unknown User",
            SenderAvatarUrl: creator?.AvatarUrl,
            Content: message.Content,
            MessageType: message.MessageType.ToString(),
            CreatedAt: message.CreatedAt,
            IsPinned: message.IsPinned,
            Reactions: message.Reactions
                .Select(r => MessageReactionDto.FromDomain(r)!)
                .ToList(),
            Attachment: AttachmentDto.FromDomain(message.Attachment),
            ForwardFromMessageId: message.ForwardFromMessageId
        );
    }
}
