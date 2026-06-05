using Domain.Entities;

namespace Application.Abstractions.Repositories
{
    public interface IReelRepository
    {
        Task<Reel?> GetByIdAsync(long id, CancellationToken cancellationToken = default);
        Task<IEnumerable<Reel>> GetByAuthorIdAsync(Guid authorId, CancellationToken cancellationToken = default);
        Task<StorySeen?> GetStorySeenAsync(long storyId, Guid userId, CancellationToken cancellationToken = default);
        void Add(Reel reel);
        void AddStorySeen(StorySeen storySeen);
        void Update(Reel reel);
        void Delete(Reel reel);
    }
}
