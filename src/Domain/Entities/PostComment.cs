using Domain.Common;

namespace Domain.Entities
{
    public class PostComment : BaseEntity
    {
        public long PostId { get; private set; }
        public Guid UserId { get; private set; }
        public long? ParentCommentId { get; private set; }
        public Guid? RepliedUserId { get; private set; }
        public string Content { get; private set; } = string.Empty;

        // Navigation
        public Post Post { get; private set; } = null!;
        public User User { get; private set; } = null!;
        public PostComment? ParentComment { get; private set; }
        public User? RepliedUser { get; private set; }

        private readonly List<PostComment> _replies = new();
        private readonly List<CommentReaction> _reactions = new();

        // Navigation Collections
        public virtual IReadOnlyCollection<PostComment> Replies => _replies;
        public virtual IReadOnlyCollection<CommentReaction> Reactions => _reactions;

        private PostComment(long id) : base(id) { }

        public PostComment(
            long id,
            long postId,
            Guid userId,
            long? parentCommentId,
            string content,
            Guid? repliedUserId = null) : base(id)
        {
            PostId = postId;
            UserId = userId;
            ParentCommentId = parentCommentId;
            RepliedUserId = repliedUserId;
            Content = content.Trim();
            CreatedAt = DateTime.UtcNow;
        }

        public void Update(string content)
        {
            Content = content.Trim();
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
