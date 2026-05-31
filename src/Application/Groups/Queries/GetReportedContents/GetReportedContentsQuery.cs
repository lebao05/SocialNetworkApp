using Application.Abstractions.Messaging;
using Application.DTOs.Groups;
using Application.Shared;
using Domain.Enums;

namespace Application.Groups.Queries.GetReportedContents
{
    public sealed record GetReportedContentsQuery(
        Guid RequesterUserId,
        long GroupId,
        int Page = 1,
        int PageSize = 20,
        GroupReportStatus? Status = null) : IQuery<PagedList<ReportedGroupContentDto>>;
}
