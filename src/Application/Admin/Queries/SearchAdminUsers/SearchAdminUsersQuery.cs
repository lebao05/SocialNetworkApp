using Application.Abstractions.Messaging;
using Application.DTOs.Admin;
using Application.Shared;

namespace Application.Admin.Queries.SearchAdminUsers;

/// <summary>
/// Paged list for the admin Users page. Filters are all nullable;
/// passing null/empty means "no filter for this dimension".
/// </summary>
public sealed record SearchAdminUsersQuery(
    string? SearchQuery,
    string? Status,
    string? Role,
    int Page = 1,
    int PageSize = 20
) : IQuery<PagedList<AdminUserRowDto>>;