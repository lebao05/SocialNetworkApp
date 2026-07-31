using Domain.Common;
using Domain.Enums;

namespace Domain.Entities;

/// <summary>
/// A report submitted by any user about any content type (post, reel, user, group).
/// Admins review submitted reports and either act on them or dismiss them.
/// </summary>
public class Report : AggregateRoot
{
    // ── Who reported ────────────────────────────────────────────
    public Guid ReporterId { get; private set; }

    // ── What was reported ──────────────────────────────────────
    public ReportType ReportType { get; private set; }

    /// <summary>Populated when ReportType = Post.</summary>
    public long? PostId { get; private set; }

    /// <summary>Populated when ReportType = Reel.</summary>
    public long? ReelId { get; private set; }

    /// <summary>Populated when ReportType = User.</summary>
    public Guid? UserId { get; private set; }

    /// <summary>Populated when ReportType = Group.</summary>
    public long? GroupId { get; private set; }

    // ── Report content ─────────────────────────────────────────
    public ReportReason Reason { get; private set; }

    /// <summary>Free-text detail from the reporter.</summary>
    public string? Details { get; private set; }

    // ── Review state ───────────────────────────────────────────
    public ReportStatus Status { get; private set; }

    /// <summary>Admin/moderator who reviewed this report.</summary>
    public Guid? ReviewedByUserId { get; private set; }

    public DateTime? ReviewedAt { get; private set; }

    /// <summary>Internal note left by the reviewer (action taken, dismissal reason, etc.).</summary>
    public string? ReviewNote { get; private set; }

    // ── Navigation ─────────────────────────────────────────────
    public User Reporter { get; private set; } = null!;
    public Post? Post { get; private set; }
    public Reel? Reel { get; private set; }
    public User? ReportedUser { get; private set; }
    public Group? Group { get; private set; }
    public User? ReviewedBy { get; private set; }

    private Report(long id) : base(id) { }

    public Report(
        long id,
        Guid reporterId,
        ReportType reportType,
        ReportReason reason,
        string? details = null,
        long? postId = null,
        long? reelId = null,
        Guid? userId = null,
        long? groupId = null) : base(id)
    {
        ReporterId = reporterId;
        ReportType = reportType;
        Reason = reason;
        Details = details;

        PostId  = postId;
        ReelId  = reelId;
        UserId  = userId;
        GroupId = groupId;

        Status = ReportStatus.Pending;
        CreatedAt = DateTime.UtcNow;
    }

    /// <summary>Marks the report as reviewed (violation confirmed, action taken).</summary>
    public void Review(Guid reviewerUserId, string? reviewNote)
    {
        Status = ReportStatus.Reviewed;
        ReviewedByUserId = reviewerUserId;
        ReviewNote = reviewNote;
        ReviewedAt = DateTime.UtcNow;
    }

    /// <summary>Marks the report as dismissed (no violation found).</summary>
    public void Dismiss(Guid reviewerUserId, string? reviewNote)
    {
        Status = ReportStatus.Dismissed;
        ReviewedByUserId = reviewerUserId;
        ReviewNote = reviewNote;
        ReviewedAt = DateTime.UtcNow;
    }
}
