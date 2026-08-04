using Domain.Common;

namespace Domain.Entities
{
    public class PostTag : BaseEntity
    {
        public long PostId { get; private set; }
        public Guid UserId { get; private set; }

        // Navigation
        public Post Post { get; private set; } = null!;
        public User User { get; private set; } = null!;

        private PostTag(long id) : base(id) { }

        public PostTag(
            long id,
            long postId,
            Guid userId) : base(id)
        {
            PostId = postId;
            UserId = userId;
        }
    }
}
