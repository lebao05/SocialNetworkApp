using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class Post : AggregateRoot
    {
        public Guid AuthorId { get; private set; }
        public long? GroupId { get; private set; }
        public string? Content { get; private set; }
        public PostVisibility Visibility { get; private set; }
        public long? SharePostId { get; private set; }
        public string? LocationTag { get; private set; }
        public Feeling? FeelingActivity { get; private set; }


        // Soft delete
        public DateTime? DeletedAt { get; private set; }

        // Navigation
        public User Author { get; private set; } = null!;
        public Group? Group { get; private set; } = null!;
        public Post? SharePost { get; private set; }

        private readonly List<PostMedia> _media = new();
        private readonly List<PostComment> _comments = new();
        private readonly List<SavedPost> _savedPosts = new();
        private readonly List<UserFeed> _userFeeds = new();
        private readonly List<Reaction> _reactions = new();
        private readonly List<PostTag> _tags = new();

        // Navigation Collections
        public virtual IReadOnlyCollection<PostMedia> Media => _media;
        public virtual IReadOnlyCollection<PostComment> Comments => _comments;
        public virtual IReadOnlyCollection<SavedPost> SavedPosts => _savedPosts;
        public virtual IReadOnlyCollection<UserFeed> UserFeeds => _userFeeds;
        public virtual IReadOnlyCollection<Reaction> Reactions => _reactions;
        public virtual IReadOnlyCollection<PostTag> Tags => _tags;

        private Post(long id) : base(id) { }

        public Post(
            long id,
            Guid authorId,
            long? groupId,
            string? content,
            PostVisibility visibility,
            long? sharePostId = null,
            string? locationTag = null,
            Feeling? feelingActivity = null) : base(id)
        {
            AuthorId = authorId;
            GroupId = groupId;
            Content = string.IsNullOrWhiteSpace(content) ? null : content.Trim();
            Visibility = visibility;
            SharePostId = sharePostId;
            LocationTag = locationTag;
            FeelingActivity = feelingActivity;
            CreatedAt = DateTime.UtcNow;
        }

        public void Update(
            string? content,
            PostVisibility visibility,
            string? locationTag,
            Feeling? feelingActivity)
        {
            Content = string.IsNullOrWhiteSpace(content) ? null : content.Trim();
            Visibility = visibility;
            LocationTag = locationTag;
            FeelingActivity = feelingActivity;
            UpdatedAt = DateTime.UtcNow;
        }

        public void SoftDelete()
        {
            IsDeleted = true;
            DeletedAt = DateTime.UtcNow;
        }

        public void Restore()
        {
            IsDeleted = false;
            DeletedAt = null;
        }

        // Tag management
        public void AddTag(PostTag tag)
        {
            _tags.Add(tag);
        }

        public void RemoveTag(PostTag tag)
        {
            _tags.Remove(tag);
        }

        public void ClearTags()
        {
            _tags.Clear();
        }

        // Media management
        public void AddMedia(PostMedia media)
        {
            _media.Add(media);
        }

        public void RemoveMedia(PostMedia media)
        {
            _media.Remove(media);
        }

        public void ClearMedia()
        {
            _media.Clear();
        }
    }
}
