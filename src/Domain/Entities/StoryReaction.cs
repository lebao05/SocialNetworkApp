using Domain.Common;

namespace Domain.Entities;

public class StoryReaction : BaseEntity
{
    public Guid UserId { get; private set; }
    public long StoryId { get; private set; }

    public User User { get; private set; } = null!;
    public Story Story { get; private set; } = null!;

    private StoryReaction(long id) : base(id) { }

    public StoryReaction(long id, Guid userId, long storyId)
        : base(id)
    {
        UserId = userId;
        StoryId = storyId;
    }
}
