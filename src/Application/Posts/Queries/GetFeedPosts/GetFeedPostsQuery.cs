using Application.Abstractions.Messaging;
using Application.DTOs.Feeds;
using Application.Shared;

namespace Application.Posts.Queries.GetFeedPosts
{
    public sealed record GetFeedPostsQuery(
        Guid UserId,
        int Page = 1,
        int PageSize = 20,
        bool IsRefresh = false
    ) : IQuery<PagedList<FeedPostDto>>;
}
