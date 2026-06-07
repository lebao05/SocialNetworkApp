using Domain.Common;

namespace Domain.Entities
{
    public class ReelReaction : BaseEntity
    {
        public Guid UserId { get; private set; }
        public long ReelId { get; private set; }

        public User User { get; private set; } = null!;
        public Reel Reel { get; private set; } = null!;

        private ReelReaction(long id) : base(id) { }

        public ReelReaction(long id, Guid userId, long reelId)
            : base(id)
        {
            UserId = userId;
            ReelId = reelId;
        }
    }
}
