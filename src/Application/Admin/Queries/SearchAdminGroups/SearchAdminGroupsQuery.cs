using Application.Abstractions.Messaging;
using Application.DTOs.Admin;
using Application.Shared;

namespace Application.Admin.Queries.SearchAdminGroups;

public sealed record SearchAdminGroupsQuery(
    string? SearchQuery,
    string? Privacy,
    string? Status,
    int Page = 1,
    int PageSize = 20
) : IQuery<PagedList<AdminGroupRowDto>>;