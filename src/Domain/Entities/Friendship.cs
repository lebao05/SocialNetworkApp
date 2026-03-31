using Domain.Common;

namespace Domain.Entities
{
    public class Friendship : BaseEntity
    {
        public Guid User1Id { get; private set; }
        public Guid User2Id { get; private set; }

        // Navigation
        public User User1 { get; private set; } = null!;
        public User User2 { get; private set; } = null!;

        private Friendship(long id) : base(id) { }

        public Friendship(Guid user1Id, Guid user2Id, long id) : base(id)
        {

            if (user1Id.CompareTo(user2Id) < 0)
            {
                User1Id = user1Id;
                User2Id = user2Id;
            }
            else
            {
                User1Id = user2Id;
                User2Id = user1Id;
            }
        }
    }
}
