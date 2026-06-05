using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class Reel : AggregateRoot
    {
        public Guid AuthorId { get; private set; }
        public string VideoUrl { get; private set; } = string.Empty;
        public string? ThumbnailUrl { get; private set; }
        public string? Caption { get; private set; }
        public string? AudioTitle { get; private set; }
        public string? Duration { get; private set; }
        public ReelVisibility Visibility { get; private set; }

        public User Author { get; private set; } = null!;

        private readonly List<ReelComment> _comments = new();
        private readonly List<ReelReaction> _reactions = new();
        private readonly List<StorySeen> _seenByUsers = new();

        public virtual IReadOnlyCollection<ReelComment> Comments => _comments;
        public virtual IReadOnlyCollection<ReelReaction> Reactions => _reactions;
        public virtual IReadOnlyCollection<StorySeen> SeenByUsers => _seenByUsers;

        private Reel(long id) : base(id) { }

        public Reel(
            long id,
            Guid authorId,
            string videoUrl,
            string? thumbnailUrl,
            string? caption,
            string? audioTitle,
            string? duration,
            ReelVisibility visibility) : base(id)
        {
            AuthorId = authorId;
            VideoUrl = string.IsNullOrWhiteSpace(videoUrl) ? throw new ArgumentException("Video URL is required.", nameof(videoUrl)) : videoUrl.Trim();
            ThumbnailUrl = string.IsNullOrWhiteSpace(thumbnailUrl) ? null : thumbnailUrl.Trim();
            Caption = string.IsNullOrWhiteSpace(caption) ? null : caption.Trim();
            AudioTitle = string.IsNullOrWhiteSpace(audioTitle) ? null : audioTitle.Trim();
            Duration = string.IsNullOrWhiteSpace(duration) ? null : duration.Trim();
            Visibility = visibility;
            CreatedAt = DateTime.UtcNow;
        }

        public void Update(
            string videoUrl,
            string? thumbnailUrl,
            string? caption,
            string? audioTitle,
            string? duration,
            ReelVisibility visibility)
        {
            VideoUrl = string.IsNullOrWhiteSpace(videoUrl) ? throw new ArgumentException("Video URL is required.", nameof(videoUrl)) : videoUrl.Trim();
            ThumbnailUrl = string.IsNullOrWhiteSpace(thumbnailUrl) ? null : thumbnailUrl.Trim();
            Caption = string.IsNullOrWhiteSpace(caption) ? null : caption.Trim();
            AudioTitle = string.IsNullOrWhiteSpace(audioTitle) ? null : audioTitle.Trim();
            Duration = string.IsNullOrWhiteSpace(duration) ? null : duration.Trim();
            Visibility = visibility;
            UpdatedAt = DateTime.UtcNow;
        }

        public void SoftDelete()
        {
            DeletedAt = DateTime.UtcNow;
        }

        public void Restore()
        {
            DeletedAt = null;
        }
    }
}
