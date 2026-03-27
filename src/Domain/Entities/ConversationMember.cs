using Domain.Common;

namespace Domain.Entities;

public class ConversationMember : BaseEntity
{
    public long ConversationId { get; private set; }
    public Guid UserId { get; private set; }

    public string Role { get; private set; } = null!;
    public DateTime JoinedAt { get; private set; }
    public long? LastReadMessageId { get; private set; }
    public bool IsNotificationOn { get; private set; }
    private readonly List<MemberMessage> _memberMessages = new();
    public IReadOnlyCollection<MemberMessage> MemberMessages => _memberMessages;
    // Navigation properties
    public Conversation Conversation { get; private set; } = null!;
    public User User { get; private set; } = null!;
    private ConversationMember(long id): base(id) {}
    public ConversationMember(long id,long conversationId, Guid userId, string role) : base(id)
    {
        ConversationId = conversationId;
        UserId = userId;
        Role = role;
        JoinedAt = DateTime.UtcNow;
        IsNotificationOn = true;
    }
}