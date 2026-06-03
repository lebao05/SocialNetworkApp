using Application.Abstractions.Messaging;
using Application.DTOs.Groups;
using Application.Shared;

namespace Application.Groups.Queries.GetGroupJoinRequests
{
    public sealed record GetGroupJoinRequestsQuery(
        Guid RequesterUserId,
        long GroupId,
        int Page = 1,
        int PageSize = 20,
        string? SearchTerm = null,
        DateTime? FromDate = null,
        bool? HaveAvatar = null) : IQuery<PagedList<GroupJoinRequestDto>>;
}
