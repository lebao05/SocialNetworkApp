using Domain.Common;
using Domain.Enums;

namespace Domain.Entities;

public class Message : AggregateRoot
{
    public long ConversationId { get; private set; }
    public long CreatorId { get; private set; }

    public string Content { get; private set; } = null!;
    public long? ReplyToMessageId { get; private set; }
    public MessageType MessageType { get; private set; }

    public bool IsDeleted { get; private set; }
    public bool IsSystemMessage { get; private set; }
    public bool IsPinned { get; private set; }

    // Navigation properties
    public Conversation Conversation { get; private set; } = null!;
    public User Creator { get; private set; } = null!;

    public Message? ReplyToMessage { get; private set; }
    private readonly List<Message> _replies = new();
    public IReadOnlyCollection<Message> Replies => _replies;

    private readonly List<MessageAttachment> _attachments = new();
    public IReadOnlyCollection<MessageAttachment> Attachments => _attachments;

    private readonly List<MemberMessage> _memberMessages = new();
    public IReadOnlyCollection<MemberMessage> MemberMessages => _memberMessages;
    private Message(long Id):base(Id) { }

    public Message(
        long id,
        long conversationId,
        long creatorId,
        string content,
        long? replyToMessageId = null)
        : base(id)
    {
        ConversationId = conversationId;
        CreatorId = creatorId;
        Content = content;
        ReplyToMessageId = replyToMessageId;
        MessageType = MessageType.Normal;
    }
}