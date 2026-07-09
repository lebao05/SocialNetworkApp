using Application.Abstractions.Messaging;
using Application.DTOs.Posts;
using Application.Shared;

namespace Application.Posts.Queries.GetSavedPosts
{
    public sealed record GetSavedPostsQuery(
        Guid UserId,
        int Page = 1,
        int PageSize = 20
    ) : IQuery<PagedList<SavedPostDto>>;
}
