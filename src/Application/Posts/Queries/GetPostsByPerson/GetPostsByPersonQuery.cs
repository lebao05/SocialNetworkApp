using Application.Abstractions.Messaging;
using Application.DTOs.Posts;
using Application.Shared;

namespace Application.Posts.Queries.GetPostsByPerson
{
    public sealed record GetPostsByPersonQuery(
        Guid AuthorId,
        int Page = 1,
        int PageSize = 10
    ) : IQuery<PagedList<PostDto>>;
}
