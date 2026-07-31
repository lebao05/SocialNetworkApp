using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;

namespace Application.Admin.Commands.ReviewReport;

internal sealed class ReviewReportCommandHandler : ICommandHandler<ReviewReportCommand, ReviewReportResult>
{
    private readonly IReportRepository _reports;
    private readonly IPostRepository _posts;
    private readonly IReelRepository _reels;
    private readonly IGroupRepository _groups;

    public ReviewReportCommandHandler(
        IReportRepository reports,
        IPostRepository posts,
        IReelRepository reels,
        IGroupRepository groups)
    {
        _reports = reports;
        _posts = posts;
        _reels = reels;
        _groups = groups;
    }

    public async Task<Result<ReviewReportResult>> Handle(
        ReviewReportCommand request,
        CancellationToken cancellationToken)
    {
        // Load report with its content
        var report = await _reports.GetByIdWithContentAsync(request.ReportId, cancellationToken);
        if (report is null)
            return Result.Failure<ReviewReportResult>(
                new Error("Admin.ReportNotFound", "Report not found."));

        // ── Step 1: optionally act on the underlying content ──────────────────
        switch (request.Action)
        {
            case ReportReviewAction.Lock:
                await ApplyLockAsync(report, true, cancellationToken);
                break;
            case ReportReviewAction.Unlock:
                await ApplyLockAsync(report, false, cancellationToken);
                break;
        }

        // ── Step 2: mark report as Reviewed or Dismissed ────────────────────
        if (request.IsDismissed)
            report.Dismiss(request.ReviewerId, request.ReviewNote);
        else
            report.Review(request.ReviewerId, request.ReviewNote);

        _reports.Update(report);
        await _reports.SaveChangesAsync(cancellationToken);

        return Result.Success(new ReviewReportResult(
            report.Id,
            report.Status,
            GetContentId(report),
            report.ReportType.ToString()));
    }

    private async Task ApplyLockAsync(Report report, bool shouldLock, CancellationToken ct)
    {
        switch (report.ReportType)
        {
            case ReportType.Post when report.Post is not null:
                if (shouldLock) report.Post.Lock(); else report.Post.Unlock();
                break;
            case ReportType.Reel when report.Reel is not null:
                if (shouldLock) report.Reel.Lock(); else report.Reel.Unlock();
                break;
            case ReportType.Group when report.GroupId.HasValue:
                await _groups.SetLockedAsync(report.GroupId.Value, shouldLock, ct);
                break;
        }
    }

    private static long? GetContentId(Report report) => report.ReportType switch
    {
        ReportType.Post  => report.PostId,
        ReportType.Reel => report.ReelId,
        ReportType.Group => report.GroupId,
        _                => null
    };
}
