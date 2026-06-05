using Domain.Common;

namespace Domain.Entities
{
    public class ReelComment : BaseEntity
    {
        public long ReelId { get; private set; }
        public Guid UserId { get; private set; }
        public long? ParentCommentId { get; private set; }
        public Guid? RepliedUserId { get; private set; }
        public string Content { get; private set; } = string.Empty;

        public Reel Reel { get; private set; } = null!;
        public User User { get; private set; } = null!;
        public ReelComment? ParentComment { get; private set; }
        public User? RepliedUser { get; private set; }

        private readonly List<ReelComment> _replies = new();

        public virtual IReadOnlyCollection<ReelComment> Replies => _replies;

        private ReelComment(long id) : base(id) { }

        public ReelComment(
            long id,
            long reelId,
            Guid userId,
            long? parentCommentId,
            string content,
            Guid? repliedUserId = null) : base(id)
        {
            ReelId = reelId;
            UserId = userId;
            ParentCommentId = parentCommentId;
            RepliedUserId = repliedUserId;
            Content = string.IsNullOrWhiteSpace(content) ? throw new ArgumentException("Content is required.", nameof(content)) : content.Trim();
            CreatedAt = DateTime.UtcNow;
        }

        public void Update(string content)
        {
            Content = string.IsNullOrWhiteSpace(content) ? throw new ArgumentException("Content is required.", nameof(content)) : content.Trim();
            UpdatedAt = DateTime.UtcNow;
        }

        public void SoftDelete()
        {
            DeletedAt = DateTime.UtcNow;
        }
    }
}
