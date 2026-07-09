using Application.DTOs.Search;
using Domain.Entities;
using Application.Shared;

namespace Application.Abstractions.Repositories
{
    public interface IReelRepository
    {
        Task<Reel?> GetByIdAsync(long id, CancellationToken cancellationToken = default);
        Task<IEnumerable<Reel>> GetByAuthorIdAsync(Guid authorId, CancellationToken cancellationToken = default);
        Task<IEnumerable<Reel>> GetRecentReelsAsync(DateTime since, CancellationToken cancellationToken = default);
        Task<IEnumerable<Reel>> GetTopReelsAsync(DateTime since, int pageSize, CancellationToken cancellationToken = default);
        Task<ReelReaction?> GetReactionAsync(long reelId, Guid userId, CancellationToken cancellationToken = default);
        Task<ReelComment?> GetCommentByIdAsync(long commentId, CancellationToken cancellationToken = default);
        Task<PagedList<ReelComment>> GetCommentsPagedAsync(long reelId, long? parentCommentId, int page, int pageSize, CancellationToken cancellationToken = default);
        Task<Dictionary<long, int>> GetReplyCountsAsync(IEnumerable<long> commentIds, CancellationToken cancellationToken = default);
        void Add(Reel reel);
        void AddComment(ReelComment comment);
        void AddReaction(ReelReaction reaction);
        void RemoveReaction(ReelReaction reaction);
        void Update(Reel reel);
        void Delete(Reel reel);
        Task<PagedList<SearchReelDto>> SearchAsync(string? searchQuery, int page, int pageSize, CancellationToken cancellationToken = default);
    }
}
