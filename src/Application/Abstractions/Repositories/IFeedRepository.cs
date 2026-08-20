using Application.DTOs.Feeds;

namespace Application.Abstractions.Repositories
{
    public interface IFeedRepository
    {
        Task<List<FeedPostDto>> GetPostsAsync(Guid userId, int pageSize, bool isRefresh = false, CancellationToken cancellationToken = default);
        Task<int> MarkAsSeenAsync(Guid userId, List<long> feedIds, CancellationToken cancellationToken = default);
    }
}