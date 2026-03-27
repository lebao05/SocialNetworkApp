using Domain.Common;

namespace Domain.Entities;

public class MemberMessage : BaseEntity
{
    public long ConversationMemberId { get; private set; }
    public Guid UserId { get; private set; }

    public long MessageId { get; private set; }

    public MessageStatus Status { get; private set; }
    public string? Emotion { get; private set; }
    public bool IsInvoked { get; private set; }
    public DateTime? ReceivedAt { get; private set; }

    // Navigation
    public ConversationMember ConversationMember { get; private set; } = null!;
    public Message Message { get; private set; } = null!;

    private MemberMessage(long id) : base(id) { }

    public MemberMessage(long conversationMemberId, long messageId, long id)
        : base(id)
    {
        ConversationMemberId = conversationMemberId;
        MessageId = messageId;
        Status = MessageStatus.Sent;
    }
}