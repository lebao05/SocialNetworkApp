using Domain.Common;
using Domain.Enums;

namespace Domain.Entities;

public class Message : AggregateRoot
{
    public long ConversationId { get; private set; }
    public Guid CreatorId { get; private set; }

    public string Content { get; private set; } = null!;
    public long? ReplyToMessageId { get; private set; }
    public MessageType MessageType { get; private set; }

    public bool IsDeleted { get; private set; }
    public bool IsSystemMessage { get; private set; }
    public bool IsPinned { get; private set; }

    // Navigation properties
    public Conversation Conversation { get; private set; } = null!;
    public User Creator { get; private set; } = null!;
    public MessageAttachment? Attachment { get; private set; }
    public Message? ReplyToMessage { get; private set; }
    private readonly List<Message> _replies = new();
    public IReadOnlyCollection<Message> Replies => _replies;

    private readonly List<MemberMessage> _memberMessages = new();
    public IReadOnlyCollection<MemberMessage> MemberMessages => _memberMessages;
    private Message(long Id):base(Id) { }

    public Message(long id, long conversationId, Guid senderId, string content)
            : base(id)
    {
        ConversationId = conversationId;
        CreatorId = senderId;
        Content = content;
        CreatedAt = DateTime.UtcNow;
    }

    public void AddRecipient(MemberMessage memberMessage)
    {
        _memberMessages.Add(memberMessage);
    }
}