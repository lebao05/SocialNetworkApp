using Application.DTOs.Feeds;
using Application.Shared;

namespace Application.Abstractions.Repositories
{
    public interface IFeedRepository
    {
        Task<PagedList<FeedPostDto>> GetPostsAsync(Guid userId, int page, int pageSize, CancellationToken cancellationToken = default);
        Task<int> MarkLatestAsSeenAsync(Guid userId, int count, CancellationToken cancellationToken = default);
    }
}
