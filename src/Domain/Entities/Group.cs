using Domain.Common;
using Domain.Enums;
using System.Linq;

namespace Domain.Entities
{
    public class Group : AggregateRoot
    {
        public Guid OwnerUserId { get; private set; }
        public string Name { get; private set; } = string.Empty;
        public string? Description { get; private set; }
        public GroupPrivacyType PrivacyType { get; private set; }
        public string? CoverPhotoUrl { get; private set; }

        // ── Group Settings ────────────────────────────────────────────────
        /// <summary>When true every new post must be approved before it becomes visible.</summary>
        public bool IsPostApprovalRequired { get; private set; }
        /// <summary>When true joining the group requires approval.</summary>
        public bool IsGroupJoinApprovalRequired { get; private set; }
        /// <summary>When true members may post/comment anonymously.</summary>
        public bool AllowAnonymousPost { get; private set; }

        // Navigation Property
        public User Owner { get; private set; } = null!;

        private readonly List<GroupMember> _members = new();
        private readonly List<GroupJoinRequest> _requests = new();
        private readonly List<Post> _posts = new();
        private readonly List<GroupRule> _rules = new();

        // Navigation Collections
        public virtual IReadOnlyCollection<GroupMember> Members => _members;
        public virtual IReadOnlyCollection<GroupJoinRequest> Requests => _requests;
        public virtual IReadOnlyCollection<Post> Posts => _posts;
        public virtual IReadOnlyCollection<GroupRule> Rules => _rules;

        private Group(long id) : base(id) { }

        public Group(
            long id,
            Guid ownerUserId,
            string name,
            string? description,
            GroupPrivacyType privacyType,
            string? coverPhotoUrl,
            bool isPostApprovalRequired = false,
            bool isGroupJoinApprovalRequired = false,
            bool allowAnonymousPost = false) : base(id)
        {
            OwnerUserId = ownerUserId;
            Name = name.Trim();
            Description = description;
            PrivacyType = privacyType;
            CoverPhotoUrl = coverPhotoUrl;
            IsPostApprovalRequired = isPostApprovalRequired;
            IsGroupJoinApprovalRequired = isGroupJoinApprovalRequired;
            AllowAnonymousPost = allowAnonymousPost;
            if (privacyType == GroupPrivacyType.Private)
                IsGroupJoinApprovalRequired = true;
        }

        public void Update(
            string name,
            string? description,
            GroupPrivacyType privacyType,
            bool isPostApprovalRequired,
            bool isGroupJoinApprovalRequired,
            bool allowAnonymousPost)
        {
            Name = name.Trim();
            Description = description;
            PrivacyType = privacyType;
            IsPostApprovalRequired = isPostApprovalRequired;
            IsGroupJoinApprovalRequired = isGroupJoinApprovalRequired;
            AllowAnonymousPost = allowAnonymousPost;
        }

        public void UpdateCoverPhoto(string? coverPhotoUrl)
        {
            CoverPhotoUrl = coverPhotoUrl;
        }

        public void AddMember(Guid userId, GroupMemberRole role = GroupMemberRole.Member)
        {
            if (_members.Any(m => m.UserId == userId))
                return;

            _members.Add(new GroupMember(0, Id, userId, role));
        }

        public bool RemoveMember(Guid userId)
        {
            var member = _members.FirstOrDefault(m => m.UserId == userId);
            if (member is null)
                return false;

            _members.Remove(member);
            return true;
        }

        public void AddJoinRequest(Guid userId)
        {
            if (_requests.Any(r => r.UserId == userId && r.Status == GroupRequestStatus.Pending))
                return;

            var existingRequest = _requests.FirstOrDefault(r => r.UserId == userId);
            if (existingRequest != null)
            {
                _requests.Remove(existingRequest);
            }

            _requests.Add(new GroupJoinRequest(0, Id, userId));
        }

        public bool IsModeratorOrAdmin(Guid userId)
        {
            if (OwnerUserId == userId)
                return true;

            var member = _members.FirstOrDefault(m => m.UserId == userId);
            return member != null && (member.Role == GroupMemberRole.Admin || member.Role == GroupMemberRole.Moderator);
        }

        public void ApproveJoinRequest(long requestId)
        {
            var request = _requests.FirstOrDefault(r => r.Id == requestId);
            if (request == null || request.Status != GroupRequestStatus.Pending)
                return;

            request.Accept();
            AddMember(request.UserId);
        }

        public void RejectJoinRequest(long requestId)
        {
            var request = _requests.FirstOrDefault(r => r.Id == requestId);
            if (request == null || request.Status != GroupRequestStatus.Pending)
                return;

            request.Reject();
        }

        public void AddRule(string title, string description)
        {
            if (string.IsNullOrWhiteSpace(title) || string.IsNullOrWhiteSpace(description))
                return;

            _rules.Add(new GroupRule(0, Id, title, description));
        }

        public void UpdateRule(long ruleId, string title, string description)
        {
            var rule = _rules.FirstOrDefault(r => r.Id == ruleId);
            if (rule != null)
            {
                rule.Update(title, description);
            }
        }

        public void RemoveRule(long ruleId)
        {
            var rule = _rules.FirstOrDefault(r => r.Id == ruleId);
            if (rule != null)
            {
                _rules.Remove(rule);
            }
        }
    }
}
