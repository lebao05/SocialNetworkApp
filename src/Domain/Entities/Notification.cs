using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class Notification : BaseEntity
    {
        public Guid RecipientUserId { get; private set; }
        public Guid? ActorUserId { get; private set; }
        public NotificationType NotificationType { get; private set; }
        public NotificationEntityType EntityType { get; private set; }
        public long? FriendRequestId { get; private set; }
        public long? GroupJoinRequestId { get; private set; }
        public long? GroupId { get; private set; }
        public long? PostId { get; private set; }
        public long? CommentId { get; private set; }
        public string? Metadata { get; private set; } // JSONB representing structured details
        public bool IsSeen { get; private set; }

        // Navigation
        public User RecipientUser { get; private set; } = null!;
        public User? ActorUser { get; private set; }
        public FriendRequest? FriendRequest { get; private set; }
        public GroupJoinRequest? GroupJoinRequest { get; private set; }
        public Group? Group { get; private set; }
        public Post? Post { get; private set; }
        public PostComment? Comment { get; private set; }

        private Notification(long id) : base(id) { }

        public Notification(
            long id,
            Guid recipientUserId,
            Guid? actorUserId,
            NotificationType notificationType,
            NotificationEntityType entityType,
            string? metadata) : base(id)
        {
            RecipientUserId = recipientUserId;
            ActorUserId = actorUserId;
            NotificationType = notificationType;
            EntityType = entityType;
            Metadata = metadata;
            IsSeen = false;
            CreatedAt = DateTime.UtcNow;
        }

        public void MarkAsSeen()
        {
            IsSeen = true;
            UpdatedAt = DateTime.UtcNow;
        }

        public void SetFriendRequestId(long friendRequestId)
        {
            FriendRequestId = friendRequestId;
        }

        public void SetGroupJoinRequestId(long groupJoinRequestId)
        {
            GroupJoinRequestId = groupJoinRequestId;
        }

        public void SetGroupId(long groupId)
        {
            GroupId = groupId;
        }

        public void SetPostId(long postId)
        {
            PostId = postId;
        }

        public void SetCommentId(long commentId)
        {
            CommentId = commentId;
        }
    }
}
