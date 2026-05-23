using Application.DTOs.Posts;
using Domain.Enums;

namespace Application.DTOs.Feeds
{
    public sealed record FeedPostDto(
        long FeedId,
        float Score,
        UserFeedType FeedType,
        bool IsSeen,
        DateTime FeedCreatedAt,
        PostDto Post
    );
}
