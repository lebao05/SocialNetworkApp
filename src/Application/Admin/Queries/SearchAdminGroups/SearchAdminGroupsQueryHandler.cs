using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Admin;
using Application.Shared;
using Domain.Shared;

namespace Application.Admin.Queries.SearchAdminGroups;

internal sealed class SearchAdminGroupsQueryHandler
    : IQueryHandler<SearchAdminGroupsQuery, PagedList<AdminGroupRowDto>>
{
    private readonly IGroupRepository _groups;

    public SearchAdminGroupsQueryHandler(IGroupRepository groups) => _groups = groups;

    public async Task<Result<PagedList<AdminGroupRowDto>>> Handle(
        SearchAdminGroupsQuery request,
        CancellationToken cancellationToken)
    {
        var page     = Math.Max(1, request.Page);
        var pageSize = Math.Clamp(request.PageSize, 1, 100);

        var result = await _groups.SearchAdminAsync(
            request.SearchQuery,
            request.Privacy,
            request.Status,
            page,
            pageSize,
            cancellationToken);

        return Result.Success(result);
    }
}