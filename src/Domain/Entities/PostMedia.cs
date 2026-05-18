using Domain.Common;

namespace Domain.Entities
{
    public class PostMedia : BaseEntity
    {
        public long PostId { get; private set; }
        public string MediaType { get; private set; } = string.Empty; // Image/Video/Reel
        public string MediaUrl { get; private set; } = string.Empty;
        public string? ThumbnailUrl { get; private set; }
        public string? Metadata { get; private set; } // JSONB representing dimensions, size, duration, etc.
        public DateTime UploadedAt { get; private set; }

        // Navigation
        public Post Post { get; private set; } = null!;

        private PostMedia(long id) : base(id) { }

        public PostMedia(
            long id,
            long postId,
            string mediaType,
            string mediaUrl,
            string? thumbnailUrl,
            string? metadata) : base(id)
        {
            PostId = postId;
            MediaType = mediaType.Trim();
            MediaUrl = mediaUrl.Trim();
            ThumbnailUrl = thumbnailUrl?.Trim();
            Metadata = metadata;
            UploadedAt = DateTime.UtcNow;
        }
    }
}
