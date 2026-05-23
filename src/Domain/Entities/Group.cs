using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class Group : AggregateRoot
    {
        public Guid OwnerUserId { get; private set; }
        public string Name { get; private set; } = string.Empty;
        public string? Description { get; private set; }
        public GroupPrivacyType PrivacyType { get; private set; }
        public string? CoverPhotoUrl { get; private set; }

        // Navigation Property
        public User Owner { get; private set; } = null!;

        private readonly List<GroupMember> _members = new();
        private readonly List<GroupRequest> _requests = new();
        private readonly List<Post> _posts = new();

        // Navigation Collections
        public virtual IReadOnlyCollection<GroupMember> Members => _members;
        public virtual IReadOnlyCollection<GroupRequest> Requests => _requests;
        public virtual IReadOnlyCollection<Post> Posts => _posts;

        private Group(long id) : base(id) { }

        public Group(
            long id,
            Guid ownerUserId,
            string name,
            string? description,
            GroupPrivacyType privacyType,
            string? coverPhotoUrl) : base(id)
        {
            OwnerUserId = ownerUserId;
            Name = name.Trim();
            Description = description;
            PrivacyType = privacyType;
            CoverPhotoUrl = coverPhotoUrl;
        }

        public void Update(string name, string? description, GroupPrivacyType privacyType, string? coverPhotoUrl)
        {
            Name = name.Trim();
            Description = description;
            PrivacyType = privacyType;
            CoverPhotoUrl = coverPhotoUrl;
        }
    }
}
