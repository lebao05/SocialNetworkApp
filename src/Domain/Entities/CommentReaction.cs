using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class CommentReaction : BaseEntity
    {
        public Guid UserId { get; private set; }
        public ReactionType ReactionType { get; private set; }
        public User User { get; private set; } = null!;

        public long CommentId { get; private set; }
        public PostComment Comment { get; private set; } = null!;

        private CommentReaction(long id) : base(id) { }

        public CommentReaction(long id, Guid userId, long commentId, ReactionType reactionType)
            : base(id)
        {
            UserId = userId;
            CommentId = commentId;
            ReactionType = reactionType;
        }

        public void UpdateReaction(ReactionType newReactionType)
        {
            ReactionType = newReactionType;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
