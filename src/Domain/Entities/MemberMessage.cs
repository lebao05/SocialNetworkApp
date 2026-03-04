namespace Domain.Entities;

public class MemberMessage
{
    public long ConversationId { get; private set; }
    public long MessageId { get; private set; }
    public long UserId { get; private set; }

    public MessageStatus Status { get; private set; }
    public string? Emotion { get; private set; }
    public bool IsInvoked { get; private set; }
    public DateTime? ReceivedAt { get; private set; }

    // Navigation properties
    public Conversation Conversation { get; private set; } = null!;
    public Message Message { get; private set; } = null!;
    public User User { get; private set; } = null!;

    private MemberMessage() { }

    public MemberMessage(
        long conversationId,
        long messageId,
        long userId)
    {
        ConversationId = conversationId;
        MessageId = messageId;
        UserId = userId;
        Status = MessageStatus.Sent;
    }
}