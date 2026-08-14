using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Admin;
using Domain.Enums;
using Domain.Shared;

namespace Application.Report.Queries.GetReportById;

internal sealed class GetReportByIdQueryHandler : IQueryHandler<GetReportByIdQuery, ReportDto>
{
    private readonly IReportRepository _reports;

    public GetReportByIdQueryHandler(IReportRepository reports) => _reports = reports;

    public async Task<Result<ReportDto>> Handle(
        GetReportByIdQuery request,
        CancellationToken cancellationToken)
    {
        var report = await _reports.GetByIdWithContentAsync(request.Id, cancellationToken);
        if (report is null)
            return Result.Failure<ReportDto>(new Error("Report.NotFound", "Report not found."));

        var reportCount = await _reports.GetDistinctReporterCountAsync(
            report.ReportType, report.PostId, report.ReelId, report.UserId, report.GroupId, cancellationToken);

        return Result.Success(ProjectToDto(report, reportCount));
    }

    private static ReportDto ProjectToDto(Domain.Entities.Report r, int reportCount)
    {
        return new ReportDto(
            Id: r.Id,
            ReportType: r.ReportType,
            Reporter: new ReporterSummaryDto(
                r.ReporterId,
                r.Reporter.FirstName + " " + r.Reporter.LastName,
                r.Reporter.AvatarUrl),
            Post: r.Post is not null ? new ReportedPostContentDto(
                Id: r.Post.Id,
                Author: new ReporterSummaryDto(
                    r.Post.AuthorId,
                    r.Post.Author.FirstName + " " + r.Post.Author.LastName,
                    r.Post.Author.AvatarUrl),
                Content: r.Post.Content,
                Visibility: r.Post.Visibility,
                CreatedAt: r.Post.CreatedAt,
                ReactionCount: r.Post.Reactions.Count,
                CommentCount: r.Post.Comments.Count,
                IsAnonymous: r.Post.IsAnonymous,
                GroupName: r.Post.Group?.Name,
                GroupId: r.Post.GroupId,
                IsLocked: r.Post.IsLocked) : null,
            Reel: r.Reel is not null ? new ReportedReelContentDto(
                Id: r.Reel.Id,
                Author: new ReporterSummaryDto(
                    r.Reel.AuthorId,
                    r.Reel.Author.FirstName + " " + r.Reel.Author.LastName,
                    r.Reel.Author.AvatarUrl),
                Caption: r.Reel.Caption,
                VideoUrl: r.Reel.VideoUrl,
                ThumbnailUrl: r.Reel.ThumbnailUrl,
                Duration: r.Reel.Duration,
                Visibility: r.Reel.Visibility,
                LikeCount: r.Reel.Reactions.Count,
                CommentCount: r.Reel.Comments.Count,
                ViewCount: r.Reel.ViewCount,
                CreatedAt: r.Reel.CreatedAt,
                IsLocked: r.Reel.IsLocked) : null,
            User: r.ReportedUser is not null ? new ReportedUserContentDto(
                Id: r.ReportedUser.Id,
                FirstName: r.ReportedUser.FirstName,
                LastName: r.ReportedUser.LastName,
                Email: r.ReportedUser.Email,
                Gender: r.ReportedUser.Gender,
                DateOfBirth: r.ReportedUser.DateOfBirth,
                CreatedAt: r.ReportedUser.CreatedAt,
                IsLocked: r.ReportedUser.IsLocked,
                Bio: null) : null,
            Group: r.Group is not null ? new ReportedGroupContentDto(
                Id: r.Group.Id,
                Owner: new ReporterSummaryDto(
                    r.Group.OwnerUserId,
                    r.Group.Owner.FirstName + " " + r.Group.Owner.LastName,
                    r.Group.Owner.AvatarUrl),
                Name: r.Group.Name,
                Description: r.Group.Description,
                PrivacyType: r.Group.PrivacyType,
                MemberCount: r.Group.Members.Count,
                CreatedAt: r.Group.CreatedAt,
                IsLocked: r.Group.IsLocked) : null,
            Reason: r.Reason,
            Details: r.Details,
            ReportCount: reportCount,
            Status: r.Status,
            ReviewedBy: r.ReviewedByUserId.HasValue && r.ReviewedBy is not null
                ? new ReporterSummaryDto(r.ReviewedBy.Id, r.ReviewedBy.FirstName + " " + r.ReviewedBy.LastName, r.ReviewedBy.AvatarUrl)
                : null,
            ReviewedAt: r.ReviewedAt,
            ReviewNote: r.ReviewNote,
            CreatedAt: r.CreatedAt
        );
    }
}
