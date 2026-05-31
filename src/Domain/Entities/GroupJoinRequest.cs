using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class GroupJoinRequest : BaseEntity
    {
        public long GroupId { get; private set; }
        public Guid UserId { get; private set; }
        public GroupRequestStatus Status { get; private set; }

        // Navigation
        public Group Group { get; private set; } = null!;
        public User User { get; private set; } = null!;

        private GroupJoinRequest(long id) : base(id) { }

        public GroupJoinRequest(long id, long groupId, Guid userId) : base(id)
        {
            GroupId = groupId;
            UserId = userId;
            Status = GroupRequestStatus.Pending;
            CreatedAt = DateTime.UtcNow;
        }

        public void Accept()
        {
            Status = GroupRequestStatus.Accepted;
        }

        public void Reject()
        {
            Status = GroupRequestStatus.Rejected;
        }
    }
}
