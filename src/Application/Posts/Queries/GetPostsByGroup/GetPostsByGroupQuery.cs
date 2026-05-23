using Application.Abstractions.Messaging;
using Application.DTOs.Posts;
using Application.Shared;

namespace Application.Posts.Queries.GetPostsByGroup
{
    public sealed record GetPostsByGroupQuery(
        long GroupId,
        int Page = 1,
        int PageSize = 10
    ) : IQuery<PagedList<PostDto>>;
}
