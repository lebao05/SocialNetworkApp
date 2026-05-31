using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class PostReaction : BaseEntity
    {
        public Guid UserId { get; private set; }
        public ReactionType ReactionType { get; private set; }
        public User User { get; private set; } = null!;

        public long PostId { get; private set; }
        public Post Post { get; private set; } = null!;

        private PostReaction(long id) : base(id) { }

        public PostReaction(long id, Guid userId, long postId, ReactionType reactionType)
            : base(id)
        {
            UserId = userId;
            PostId = postId;
            ReactionType = reactionType;
        }

        public void UpdateReaction(ReactionType newReactionType)
        {
            ReactionType = newReactionType;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
