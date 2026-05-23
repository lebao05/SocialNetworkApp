using Domain.Common;

namespace Domain.Entities
{
    public class InterestGroupScore : BaseEntity
    {
        public Guid UserId { get; private set; }
        public long GroupId { get; private set; }
        public float Score { get; private set; }
        public DateTime? LastInteractionAt { get; private set; }

        public User User { get; private set; } = null!;
        public Group Group { get; private set; } = null!;

        private InterestGroupScore(long id) : base(id) { }

        public InterestGroupScore(
            long id,
            Guid userId,
            long groupId,
            float score = 0) : base(id)
        {
            UserId = userId;
            GroupId = groupId;
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
