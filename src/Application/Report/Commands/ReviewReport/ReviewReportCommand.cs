using Application.Abstractions.Messaging;
using Domain.Enums;

namespace Application.Report.Commands.ReviewReport;

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
