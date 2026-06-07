using Domain.Common;

namespace Domain.Entities;

public class StorySeen : BaseEntity
{
    public long StoryId { get; private set; }
    public Guid UserId { get; private set; }
    public DateTime SeenAt { get; private set; }

    public Story Story { get; private set; } = null!;
    public User User { get; private set; } = null!;

    private StorySeen(long id = 0) : base(id) { }

    public StorySeen(long storyId, Guid userId, long id = 0) : base(id)
    {
        StoryId = storyId;
        UserId = userId;
        SeenAt = DateTime.UtcNow;
    }

    public void MarkSeen()
    {
        SeenAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
}
