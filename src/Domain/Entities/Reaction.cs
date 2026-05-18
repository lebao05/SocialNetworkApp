using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class Reaction : BaseEntity
    {
        public Guid UserId { get; private set; }
        public long? PostId { get; private set; }
        public long? CommentId { get; private set; }
        public ReactionType ReactionType { get; private set; }

        // Navigation
        public User User { get; private set; } = null!;
        public Post? Post { get; private set; }
        public PostComment? Comment { get; private set; }

        private Reaction(long id) : base(id) { }

        public Reaction(
            long id,
            Guid userId,
            long? postId,
            long? commentId,
            ReactionType reactionType) : base(id)
        {
            if (postId == null && commentId == null)
                throw new ArgumentException("Reaction must target either a Post or a Comment.");

            if (postId != null && commentId != null)
                throw new ArgumentException("Reaction cannot target both a Post and a Comment.");

            UserId = userId;
            PostId = postId;
            CommentId = commentId;
            ReactionType = reactionType;
            CreatedAt = DateTime.UtcNow;
        }

        public void UpdateReaction(ReactionType newReactionType)
        {
            ReactionType = newReactionType;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
