using Application.Abstractions.Messaging;
using Application.DTOs.Search;
using Application.Shared;

namespace Application.Users.Queries.SearchUsers
{
    public sealed record SearchUsersQuery(
        string? SearchQuery,
        Guid CurrentUserId,
        int Page = 1,
        int PageSize = 20
    ) : IQuery<PagedList<SearchUserDto>>;
}
