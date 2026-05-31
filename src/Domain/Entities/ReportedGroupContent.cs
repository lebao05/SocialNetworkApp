using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class ReportedGroupContent : BaseEntity
    {
        public long GroupId { get; private set; }

        /// <summary>The user who submitted the report.</summary>
        public Guid ReporterId { get; private set; }

        /// <summary>The reported post.</summary>
        public long PostId { get; private set; }

        public GroupReportReason Reason { get; private set; }

        /// <summary>Optional free-text detail provided by the reporter.</summary>
        public string? AdditionalDetail { get; private set; }

        public GroupReportStatus Status { get; private set; }

        /// <summary>The admin or moderator who reviewed the report.</summary>
        public Guid? ReviewedByUserId { get; private set; }

        public DateTime? ReviewedAt { get; private set; }

        /// <summary>Optional note left by the reviewer (action taken, reason for dismissal, etc.).</summary>
        public string? ReviewNote { get; private set; }

        // Navigation
        public Group Group { get; private set; } = null!;
        public Post Post { get; private set; } = null!;
        public User Reporter { get; private set; } = null!;
        public User? ReviewedBy { get; private set; }

        private ReportedGroupContent(long id) : base(id) { }

        public ReportedGroupContent(
            long id,
            long groupId,
            Guid reporterId,
            long postId,
            GroupReportReason reason,
            string? additionalDetail = null) : base(id)
        {
            GroupId = groupId;
            ReporterId = reporterId;
            PostId = postId;
            Reason = reason;
            AdditionalDetail = additionalDetail;
            Status = GroupReportStatus.Pending;
            CreatedAt = DateTime.UtcNow;
        }

        public void Review(Guid reviewerUserId, string? reviewNote)
        {
            Status = GroupReportStatus.Reviewed;
            ReviewedByUserId = reviewerUserId;
            ReviewNote = reviewNote;
            ReviewedAt = DateTime.UtcNow;
        }

        public void Dismiss(Guid reviewerUserId, string? reviewNote)
        {
            Status = GroupReportStatus.Dismissed;
            ReviewedByUserId = reviewerUserId;
            ReviewNote = reviewNote;
            ReviewedAt = DateTime.UtcNow;
        }
    }
}
