using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class ReelReaction : BaseEntity
    {
        public Guid UserId { get; private set; }
        public ReactionType ReactionType { get; private set; }
        public long ReelId { get; private set; }

        public User User { get; private set; } = null!;
        public Reel Reel { get; private set; } = null!;

        private ReelReaction(long id) : base(id) { }

        public ReelReaction(long id, Guid userId, long reelId, ReactionType reactionType)
            : base(id)
        {
            UserId = userId;
            ReelId = reelId;
            ReactionType = reactionType;
        }

        public void UpdateReaction(ReactionType newReactionType)
        {
            ReactionType = newReactionType;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
