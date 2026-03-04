namespace Domain.Entities;

public class ConversationMember
{
    public long ConversationId { get; private set; }
    public long UserId { get; private set; }

    public string Role { get; private set; } = null!;
    public DateTime JoinedAt { get; private set; }
    public long? LastReadMessageId { get; private set; }
    public bool IsNotificationOn { get; private set; }

    // Navigation properties
    public Conversation Conversation { get; private set; } = null!;
    public User User { get; private set; } = null!;
    private ConversationMember() { }
    public ConversationMember(long conversationId, long userId, string role)
    {
        ConversationId = conversationId;
        UserId = userId;
        Role = role;
        JoinedAt = DateTime.UtcNow;
        IsNotificationOn = true;
    }
}