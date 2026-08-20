using Application.Abstractions.Messaging;
using Application.DTOs.Feeds;
using Domain.Shared;

namespace Application.Posts.Queries.GetFeedPosts
{
    public sealed record GetFeedPostsQuery(
        Guid UserId,
        int PageSize = 20,
        bool IsRefresh = false
    ) : IQuery<List<FeedPostDto>>;
}
