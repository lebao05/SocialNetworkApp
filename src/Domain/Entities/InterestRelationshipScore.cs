using Domain.Common;

namespace Domain.Entities
{
    public class InterestRelationshipScore : BaseEntity
    {
        public Guid UserId { get; private set; }
        public Guid TargetUserId { get; private set; }
        public float Score { get; private set; }
        public DateTime? LastInteractionAt { get; private set; }

        public User User { get; private set; } = null!;
        public User TargetUser { get; private set; } = null!;

        private InterestRelationshipScore(long id) : base(id) { }

        public InterestRelationshipScore(
            long id,
            Guid userId,
            Guid targetUserId,
            float score = 0) : base(id)
        {
            if (userId == targetUserId)
            {
                throw new ArgumentException("A user can not have an interest score toward themselves.");
            }

            UserId = userId;
            TargetUserId = targetUserId;
            Score = Math.Max(0, score);
        }

        public void Increase(float amount)
        {
            if (amount <= 0)
            {
                return;
            }

            Score += amount;
            LastInteractionAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        public void SetScore(float score)
        {
            Score = Math.Max(0, score);
            UpdatedAt = DateTime.UtcNow;
        }

        public void Decay(float amount)
        {
            if (amount <= 0)
            {
                return;
            }

            Score = Math.Max(0, Score - amount);
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
