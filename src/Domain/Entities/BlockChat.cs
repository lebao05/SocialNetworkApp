namespace Domain.Entities;

public class BlockChat
{
    public long UserId { get; private set; }
    public long BlockedUserId { get; private set; }

    // Navigation Properties
    public User User { get; private set; } = null!;
    public User BlockedUser { get; private set; } = null!;

    private BlockChat() { }

    public BlockChat(long userId, long blockedUserId)
    {
        if (userId == blockedUserId)
            throw new InvalidOperationException("User cannot block themselves.");

        UserId = userId;
        BlockedUserId = blockedUserId;
    }
}