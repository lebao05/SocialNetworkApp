using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class UserFeed : BaseEntity
    {
        public Guid UserId { get; private set; }
        public long PostId { get; private set; }
        public Guid SourceUserId { get; private set; }
        public float Score { get; private set; }
        public UserFeedType FeedType { get; private set; }
        public bool IsSeen { get; private set; }

        // Navigation
        public User User { get; private set; } = null!;
        public Post Post { get; private set; } = null!;
        public User SourceUser { get; private set; } = null!;

        private UserFeed(long id) : base(id) { }

        public UserFeed(
            long id,
            Guid userId,
            long postId,
            Guid sourceUserId,
            float score,
            UserFeedType feedType) : base(id)
        {
            UserId = userId;
            PostId = postId;
            SourceUserId = sourceUserId;
            Score = score;
            FeedType = feedType;
            IsSeen = false;
            CreatedAt = DateTime.UtcNow;
        }

        public void MarkAsSeen()
        {
            IsSeen = true;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
