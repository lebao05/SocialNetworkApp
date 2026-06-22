namespace Application.DTOs.Messages;

public sealed record MessageDto(
    long Id,
    long ConversationId,
    Guid SenderId,
    string SenderName,
    string? SenderAvatarUrl,
    string? Content,
    Domain.Enums.MessageType MessageType,
    DateTime CreatedAt,
    bool IsPinned,
    List<MessageReactionDto> Reactions,
    AttachmentDto? Attachment,
    long? ForwardFromMessageId,
    bool IsSystemMessage,
    Domain.Enums.SystemMessageType? SystemMessageType,
    string? Payload,
    long? RepliedMessageId,
    MessageDto? RepliedMessage
)
{
    public static MessageDto FromDomain(Domain.Entities.Message message)
    {
        var creator = message.Creator;
        MessageDto? replied = null;
        if (message.ReplyToMessage is not null)
        {
            var replyCreator = message.ReplyToMessage.Creator;
            var replyAttachment = message.ReplyToMessage.Attachment;
            replied = new MessageDto(
                message.ReplyToMessage.Id,
                message.ReplyToMessage.ConversationId,
                message.ReplyToMessage.CreatorId,
                replyCreator is not null ? $"{replyCreator.FirstName} {replyCreator.LastName}" : "Unknown",
                replyCreator?.AvatarUrl,
                message.ReplyToMessage.Content,
                message.ReplyToMessage.MessageType,
                message.ReplyToMessage.CreatedAt,
                message.ReplyToMessage.IsPinned,
                message.ReplyToMessage.Reactions
                    .Select(r => MessageReactionDto.FromDomain(r)!)
                    .ToList(),
                replyAttachment is not null ? AttachmentDto.FromDomain(replyAttachment) : null,
                message.ReplyToMessage.ForwardFromMessageId,
                message.ReplyToMessage.IsSystemMessage,
                message.ReplyToMessage.SystemMessageType,
                message.ReplyToMessage.Payload,
                null,
                null
            );
        }
        return new MessageDto(
            Id: message.Id,
            ConversationId: message.ConversationId,
            SenderId: message.CreatorId,
            SenderName: creator is not null ? $"{creator.FirstName} {creator.LastName}" : "System",
            SenderAvatarUrl: creator?.AvatarUrl,
            Content: message.Content,
            MessageType: message.MessageType,
            CreatedAt: message.CreatedAt,
            IsPinned: message.IsPinned,
            Reactions: message.Reactions
                .Select(r => MessageReactionDto.FromDomain(r)!)
                .ToList(),
            Attachment: AttachmentDto.FromDomain(message.Attachment),
            ForwardFromMessageId: message.ForwardFromMessageId,
            IsSystemMessage: message.IsSystemMessage,
            SystemMessageType: message.SystemMessageType,
            Payload: message.Payload,
            RepliedMessageId: message.ReplyToMessageId,
            RepliedMessage: replied
        );
    }
}
