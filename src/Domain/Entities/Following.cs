using Domain.Common;

namespace Domain.Entities
{
    public class Following : BaseEntity
    {
        public Guid FollowerId { get; private set; }
        public Guid FolloweeId { get; private set; }

        public User Follower { get; private set; } = null!;
        public User Followee { get; private set; } = null!;

        private Following(long id) : base(id) { }

        public Following(Guid followerId, Guid followeeId, long id = 0) : base(id)
        {
            if (followerId == followeeId)
            {
                throw new ArgumentException("A user can not follow themselves.");
            }

            FollowerId = followerId;
            FolloweeId = followeeId;
        }
    }
}
