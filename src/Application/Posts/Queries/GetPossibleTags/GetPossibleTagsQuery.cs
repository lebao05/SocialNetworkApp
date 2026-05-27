using Application.Abstractions.Messaging;
using Application.Shared;
using Application.DTOs.Users;

namespace Application.Posts.Queries.GetPossibleTags
{
    public sealed record GetPossibleTagsQuery(
        string? SearchQuery = null,
        long? GroupId = null,
        int PageNumber = 1,
        int PageSize = 10
    ) : IQuery<PagedList<TaggableUserDto>>;
}
