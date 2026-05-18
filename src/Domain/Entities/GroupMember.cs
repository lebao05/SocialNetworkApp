using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class GroupMember : BaseEntity
    {
        public long GroupId { get; private set; }
        public Guid UserId { get; private set; }
        public GroupMemberRole Role { get; private set; }

        // Navigation
        public Group Group { get; private set; } = null!;
        public User User { get; private set; } = null!;

        private GroupMember(long id) : base(id) { }

        public GroupMember(long id, long groupId, Guid userId, GroupMemberRole role) : base(id)
        {
            GroupId = groupId;
            UserId = userId;
            Role = role;
            CreatedAt = DateTime.UtcNow;
        }

        public void UpdateRole(GroupMemberRole newRole)
        {
            Role = newRole;
        }
    }
}
