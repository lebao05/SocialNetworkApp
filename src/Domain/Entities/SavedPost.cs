using Domain.Common;

namespace Domain.Entities
{
    public class SavedPost : BaseEntity
    {
        public Guid UserId { get; private set; }
        public long PostId { get; private set; }

        // Navigation
        public User User { get; private set; } = null!;
        public Post Post { get; private set; } = null!;

        private SavedPost(long id) : base(id) { }

        public SavedPost(
            long id,
            Guid userId,
            long postId) : base(id)
        {
            UserId = userId;
            PostId = postId;
            CreatedAt = DateTime.UtcNow;
        }
    }
}
