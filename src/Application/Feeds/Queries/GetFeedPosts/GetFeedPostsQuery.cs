using Application.Abstractions.Messaging;
using Application.DTOs.Feeds;
using Application.Shared;

namespace Application.Feeds.Queries.GetFeedPosts
{
    public sealed record GetFeedPostsQuery(
        Guid UserId,
        int Page = 1,
        int PageSize = 20
    ) : IQuery<PagedList<FeedPostDto>>;
}
