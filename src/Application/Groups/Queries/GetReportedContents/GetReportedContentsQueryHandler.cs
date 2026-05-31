using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Groups;
using Application.Shared;
using Domain.Entities;
using Domain.Shared;

namespace Application.Groups.Queries.GetReportedContents
{
    internal sealed class GetReportedContentsQueryHandler : IQueryHandler<GetReportedContentsQuery, PagedList<ReportedGroupContentDto>>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IGroupReportRepository _groupReportRepository;

        public GetReportedContentsQueryHandler(
            IGroupRepository groupRepository,
            IGroupReportRepository groupReportRepository)
        {
            _groupRepository = groupRepository;
            _groupReportRepository = groupReportRepository;
        }

        public async Task<Result<PagedList<ReportedGroupContentDto>>> Handle(GetReportedContentsQuery request, CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdWithMembersAsync(request.GroupId, cancellationToken);
            if (group is null)
            {
                return Result.Failure<PagedList<ReportedGroupContentDto>>(new Error(
                    "Group.NotFound",
                    $"Group with id {request.GroupId} was not found."));
            }

            if (!group.IsModeratorOrAdmin(request.RequesterUserId))
            {
                return Result.Failure<PagedList<ReportedGroupContentDto>>(new Error(
                    "Group.AccessDenied",
                    "Only the group owner, admins, or moderators can view reported content."));
            }

            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 100);
            var reports = await _groupReportRepository.GetByGroupIdPagedAsync(
                request.GroupId,
                page,
                pageSize,
                request.Status,
                cancellationToken);

            return Result.Success(new PagedList<ReportedGroupContentDto>(
                reports.Items.Select(Map).ToList(),
                reports.PageNumber,
                reports.PageSize,
                reports.TotalCount));
        }

        private static ReportedGroupContentDto Map(ReportedGroupContent report)
        {
            return new ReportedGroupContentDto(
                report.Id,
                report.GroupId,
                report.PostId,
                report.ReporterId,
                report.Reporter is null ? string.Empty : $"{report.Reporter.FirstName} {report.Reporter.LastName}",
                report.Reporter?.AvatarUrl,
                report.Post.AuthorId,
                report.Post.Author is null ? string.Empty : $"{report.Post.Author.FirstName} {report.Post.Author.LastName}",
                report.Post.Content,
                report.Reason,
                report.AdditionalDetail,
                report.Status,
                report.ReviewedByUserId,
                report.ReviewedBy is null ? null : $"{report.ReviewedBy.FirstName} {report.ReviewedBy.LastName}",
                report.ReviewedAt,
                report.ReviewNote,
                report.CreatedAt);
        }
    }
}
