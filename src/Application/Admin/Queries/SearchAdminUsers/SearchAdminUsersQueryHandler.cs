using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Admin;
using Application.Shared;
using Domain.Shared;

namespace Application.Admin.Queries.SearchAdminUsers;

internal sealed class SearchAdminUsersQueryHandler
    : IQueryHandler<SearchAdminUsersQuery, PagedList<AdminUserRowDto>>
{
    private readonly IUserRepository _users;

    public SearchAdminUsersQueryHandler(IUserRepository users) => _users = users;

    public async Task<Result<PagedList<AdminUserRowDto>>> Handle(
        SearchAdminUsersQuery request,
        CancellationToken cancellationToken)
    {
        var page     = Math.Max(1, request.Page);
        var pageSize = Math.Clamp(request.PageSize, 1, 100);

        var result = await _users.SearchAdminAsync(
            request.SearchQuery,
            request.Status,
            request.Role,
            page,
            pageSize,
            cancellationToken);

        return Result.Success(result);
    }
}