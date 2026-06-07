using Domain.Common;
using Domain.Enums;
using Domain.Shared;
using Microsoft.AspNetCore.Identity;

namespace Domain.Entities
{
    public class User : IdentityUser<Guid>, IHasDomainEvents
    {
        private readonly List<IDomainEvent> _domainEvents = new();

        public IReadOnlyCollection<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();

        public void AddDomainEvent(IDomainEvent domainEvent)
        {
            _domainEvents.Add(domainEvent);
        }

        public void ClearDomainEvents()
        {
            _domainEvents.Clear();
        }
        public string FirstName { get; private set; } = string.Empty;
        public string LastName { get; private set; } = string.Empty;
        public DateOnly DateOfBirth { get; private set; }
        public string? AvatarUrl { get; private set; }
        public Gender Gender { get; private set; }

        public string? Bio { get; set; }
        public string? CoverPhotoUrl { get; set; }
        public string? CurrentLocation { get; set; }
        public string? Hometown { get; set; }
        public string? Website { get; set; }
        public RelationshipStatus? RelationshipStatus { get; set; }

        private readonly List<ConversationMember> _conversations = new();
        public IReadOnlyCollection<ConversationMember> Conversations => _conversations;

        private readonly List<BlockChat> _blockedUsers = new();
        public IReadOnlyCollection<BlockChat> BlockedUsers => _blockedUsers;

        private readonly List<Friendship> _friends = new();
        public IReadOnlyCollection<Friendship> Friends => _friends;

        private readonly List<FriendRequest> _sentRequests = new();
        public IReadOnlyCollection<FriendRequest> SentRequests => _sentRequests;

        private readonly List<FriendRequest> _receivedRequests = new();
        public IReadOnlyCollection<FriendRequest> ReceivedRequests => _receivedRequests;

        private readonly List<Following> _following = new();
        public IReadOnlyCollection<Following> Following => _following;

        private readonly List<Following> _followers = new();
        public IReadOnlyCollection<Following> Followers => _followers;

        private readonly List<Post> _posts = new();
        private readonly List<Reel> _reels = new();
        private readonly List<Story> _stories = new();
        private readonly List<StorySeen> _storySeens = new();
        private readonly List<StoryReaction> _storyReactions = new();
        private readonly List<PostComment> _comments = new();
        private readonly List<ReelComment> _reelComments = new();
        private readonly List<CommentReaction> _commentReactions = new();
        private readonly List<ReelReaction> _reelReactions = new();
        private readonly List<SavedPost> _savedPosts = new();
        private readonly List<UserFeed> _userFeeds = new();
        private readonly List<Notification> _receivedNotifications = new();
        private readonly List<Group> _ownedGroups = new();
        private readonly List<GroupMember> _groupMemberships = new();
        private readonly List<School> _schools = new();

        // Navigation Collections
        public virtual IReadOnlyCollection<Post> Posts => _posts;
        public virtual IReadOnlyCollection<Reel> Reels => _reels;
        public virtual IReadOnlyCollection<Story> Stories => _stories;
        public virtual IReadOnlyCollection<StorySeen> StorySeens => _storySeens;
        public virtual IReadOnlyCollection<StoryReaction> StoryReactions => _storyReactions;
        public virtual IReadOnlyCollection<PostComment> Comments => _comments;
        public virtual IReadOnlyCollection<ReelComment> ReelComments => _reelComments;
        public virtual IReadOnlyCollection<CommentReaction> CommentReactions => _commentReactions;
        public virtual IReadOnlyCollection<ReelReaction> ReelReactions => _reelReactions;
        public virtual IReadOnlyCollection<SavedPost> SavedPosts => _savedPosts;
        public virtual IReadOnlyCollection<UserFeed> UserFeeds => _userFeeds;
        public virtual IReadOnlyCollection<Notification> ReceivedNotifications => _receivedNotifications;
        public virtual IReadOnlyCollection<Group> OwnedGroups => _ownedGroups;
        public virtual IReadOnlyCollection<GroupMember> GroupMemberships => _groupMemberships;
        public virtual IReadOnlyCollection<School> Schools => _schools;

        private User() { }

        public User(
            string firstName,
            string lastName,
            DateOnly dateOfBirth,
            Gender gender,
            string email)
        {
            if (string.IsNullOrWhiteSpace(firstName))
                throw new ArgumentException("First name required");

            if (string.IsNullOrWhiteSpace(lastName))
                throw new ArgumentException("Last name required");

            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email required");

            FirstName = firstName;
            LastName = lastName;
            DateOfBirth = dateOfBirth;
            Gender = gender;

            Email = email;
            UserName = email;
        }

        public Result UpdatePersonalInfo(
            string firstName,
            string lastName,
            DateOnly dateOfBirth,
            Gender gender)
        {
            if (string.IsNullOrWhiteSpace(firstName))
            {
                return Result.Failure(new Error("User.FirstNameRequired", "First name is required."));
            }

            if (string.IsNullOrWhiteSpace(lastName))
            {
                return Result.Failure(new Error("User.LastNameRequired", "Last name is required."));
            }

            FirstName = firstName;
            LastName = lastName;
            DateOfBirth = dateOfBirth;
            Gender = gender;

            return Result.Success();
        }

        public void UpdateAvatarUrl(string avatarUrl)
        {
            AvatarUrl = avatarUrl;
        }

        public void UpdateCoverPhotoUrl(string coverPhotoUrl)
        {
            CoverPhotoUrl = coverPhotoUrl;
        }
    }
}
