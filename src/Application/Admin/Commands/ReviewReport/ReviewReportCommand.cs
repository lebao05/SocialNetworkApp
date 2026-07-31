using Application.Abstractions.Messaging;
using Domain.Enums;

namespace Application.Admin.Commands.ReviewReport;

/// <summary>
/// Reviews a report: marks it as Reviewed or Dismissed, and optionally locks
/// or unlocks the underlying content (post / reel / group).
///
/// The action field controls the moderation step on the content:
///   - Nothing   : do not change content visibility (dismiss false-positive)
///   - Lock      : lock the content (content stays visible but marked locked)
///   - Unlock    : unlock the content (only valid when IsLocked = true)
///
/// After the content action (if any), the report itself is marked Reviewed
/// or Dismissed, completing the moderation flow.
/// </summary>
/// <param name="ReportId">The report being reviewed.</param>
/// <param name="ReviewerId">The admin performing the review (from cookie principal).</param>
/// <param name="Action">
///   Nothing = no content change (just close the report).
///   Lock   = lock the content.
///   Unlock = unlock the content (for post/reel; ignored for user reports).
/// </param>
/// <param name="IsDismissed">
///   false → mark report as Reviewed.
///   true  → mark report as Dismissed.
/// </param>
/// <param name="ReviewNote">Optional admin note for the audit trail.</param>
public sealed record ReviewReportCommand(
    long ReportId,
    Guid ReviewerId,
    ReportReviewAction Action,
    bool IsDismissed,
    string? ReviewNote = null
) : ICommand<ReviewReportResult>;

public enum ReportReviewAction
{
    /// <summary>Do not change content visibility — used for false-positive dismissals.</summary>
    Nothing = 0,

    /// <summary>Lock the reported content (post/reel/group).</summary>
    Lock = 1,

    /// <summary>Unlock the reported content (post/reel only).</summary>
    Unlock = 2,
}

public sealed record ReviewReportResult(
    long ReportId,
    ReportStatus Status,
    long? ContentId,
    string ContentType
);
