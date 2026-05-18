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
        public string MessageTemplate { get; private set; } = string.Empty;
        public string? Metadata { get; private set; } // JSONB representing structured details
        public bool IsSeen { get; private set; }

        // Navigation
        public User RecipientUser { get; private set; } = null!;
        public User? ActorUser { get; private set; }

        private Notification(long id) : base(id) { }

        public Notification(
            long id,
            Guid recipientUserId,
            Guid? actorUserId,
            NotificationType notificationType,
            NotificationEntityType entityType,
            string messageTemplate,
            string? metadata) : base(id)
        {
            RecipientUserId = recipientUserId;
            ActorUserId = actorUserId;
            NotificationType = notificationType;
            EntityType = entityType;
            MessageTemplate = messageTemplate.Trim();
            Metadata = metadata;
            IsSeen = false;
            CreatedAt = DateTime.UtcNow;
        }

        public void MarkAsSeen()
        {
            IsSeen = true;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
