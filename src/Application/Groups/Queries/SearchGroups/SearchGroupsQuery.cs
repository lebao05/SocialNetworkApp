using Application.Abstractions.Messaging;
using Application.DTOs.Search;
using Application.Shared;

namespace Application.Groups.Queries.SearchGroups
{
    public sealed record SearchGroupsQuery(
        string? SearchQuery,
        int Page = 1,
        int PageSize = 20
    ) : IQuery<PagedList<SearchGroupDto>>;
}
