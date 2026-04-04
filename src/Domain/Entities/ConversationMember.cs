using Domain.Common;
using Domain.Enums; // Add this

namespace Domain.Entities;

public class ConversationMember : BaseEntity
{
    public long ConversationId { get; private set; }
    public Guid UserId { get; private set; }

    // Changed from string to ConversationRole
    public ConversationRole Role { get; private set; }
    public DateTime JoinedAt { get; private set; }
    public long? LastReadMessageId { get; private set; }
    public bool IsNotificationOn { get; private set; }

    private readonly List<MemberMessage> _memberMessages = new();
    public IReadOnlyCollection<MemberMessage> MemberMessages => _memberMessages;

    public Conversation Conversation { get; private set; } = null!;
    public User User { get; private set; } = null!;

    private ConversationMember(long id) : base(id) { }

    public ConversationMember(
        long id,
        long conversationId,
        Guid userId,
        ConversationRole role) : base(id)
    {
        ConversationId = conversationId;
        UserId = userId;
        Role = role;
        JoinedAt = DateTime.UtcNow;
        IsNotificationOn = true;
    }

    public void UpdateRole(ConversationRole newRole)
    {
        Role = newRole;
    }
    public void ToggleNotifications()
    {
        IsNotificationOn = !IsNotificationOn;
    }
}