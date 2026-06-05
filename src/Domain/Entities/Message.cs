using Domain.Common;
using Domain.Enums;
using Domain.Shared;

namespace Domain.Entities;

public class Message : AggregateRoot
{
    public long ConversationId { get; private set; }
    public Guid CreatorId { get; private set; }
    public string Ciphertext { get; set; } = string.Empty;
    public string? Content { get; private set; }
    public long? ReplyToMessageId { get; private set; }
    public long? ForwardFromMessageId { get; private set; }
    public MessageType MessageType { get; private set; }
    public string? SearchContent { get; private set; }

    public bool IsSystemMessage { get; private set; }
    public bool IsPinned { get; private set; }

    // Navigation properties
    public Conversation Conversation { get; private set; } = null!;
    public User Creator { get; private set; } = null!;
    public MessageAttachment? Attachment { get; private set; }
    public Message? ReplyToMessage { get; private set; }
    public Message? ForwardFromMessage { get; private set; }

    private readonly List<Message> _replies = new();
    public IReadOnlyCollection<Message> Replies => _replies;

    private readonly List<MemberMessage> _memberMessages = new();
    public IReadOnlyCollection<MemberMessage> MemberMessages => _memberMessages;

    private Message(long Id):base(Id) { }

    public Message(long id, long conversationId, Guid senderId, string? content)
            : base(id)
    {
        ConversationId = conversationId;
        CreatorId = senderId;
        Content = content;
        CreatedAt = DateTime.UtcNow;
    }

    public Result UpdateContent(Guid requesterId, string? newContent)
    {
        if (DeletedAt is not null)
        {
            return Result.Failure(new Error(
                "Message.Deleted",
                "Cannot edit a deleted message."));
        }

        if (CreatorId != requesterId)
        {
            return Result.Failure(new Error(
                "Message.Forbidden",
                "You can only edit your own message."));
        }

        Content = newContent?.Trim();
        return Result.Success();
    }

    public void UpdateSearchContent(string? searchContent)
    {
        SearchContent = searchContent;
    }

    public void SetForwardedFrom(long originalMessageId)
    {
        ForwardFromMessageId = originalMessageId;
    }

    public Result Revoke(Guid requesterId)
    {
        if (CreatorId != requesterId)
        {
            return Result.Failure(new Error(
                "Message.Forbidden",
                "You can only revoke your own message."));
        }

        Content = "This message was revoked.";
        SearchContent = null;
        return Result.Success();
    }
}