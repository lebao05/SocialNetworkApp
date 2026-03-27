using Domain.Common;

namespace Domain.Entities;

public class BlockChat : BaseEntity
{
    public Guid UserId { get; private set; }
    public Guid BlockedUserId { get; private set; }

    // Navigation Properties
    public User User { get; private set; } = null!;
    public User BlockedUser { get; private set; } = null!;

    private BlockChat(long id):base(id) { }

    public BlockChat(Guid userId, Guid blockedUserId, long id) : base(id) 
    {
        if (userId == blockedUserId)
            throw new InvalidOperationException("User cannot block themselves.");

        UserId = userId;
        BlockedUserId = blockedUserId;
    }
}