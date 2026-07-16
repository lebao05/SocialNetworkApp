using Application.Abstractions.Messaging;
using Application.DTOs.Posts;
using Application.DTOs.Search;
using Application.Shared;

namespace Application.Posts.Queries.SearchPosts
{
    public sealed record SearchPostsQuery(
        Guid userId,
        string? SearchQuery,
        int Page = 1,
        int PageSize = 20
    ) : IQuery<PagedList<PostDto>>;
}
