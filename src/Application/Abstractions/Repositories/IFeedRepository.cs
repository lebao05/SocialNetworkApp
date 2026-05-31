using Application.DTOs.Feeds;
using Application.Shared;

namespace Application.Abstractions.Repositories
{
    public interface IFeedRepository
    {
        Task<PagedList<FeedPostDto>> GetPostsAsync(Guid userId, int page, int pageSize, bool isRefresh = false, CancellationToken cancellationToken = default);
        Task<int> MarkAsSeenAsync(Guid userId, List<long> feedIds, CancellationToken cancellationToken = default);
    }
}
