using Domain.Entities;
using Application.Shared;

namespace Application.Abstractions.Repositories
{
    public interface IPostRepository
    {
        Task<Post?> GetByIdAsync(long id, CancellationToken cancellationToken = default);
        Task<IEnumerable<Post>> GetByGroupIdAsync(long groupId, CancellationToken cancellationToken = default);
        Task<PagedList<Post>> GetByGroupIdPagedAsync(long groupId, int page, int pageSize, CancellationToken cancellationToken = default);
        Task<IEnumerable<Post>> GetByAuthorIdAsync(Guid authorId, CancellationToken cancellationToken = default);
        void Add(Post post);
        void Update(Post post);
        void Delete(Post post);
        void AddMedia(PostMedia media);
        void AddTag(PostTag tag);
    }
}
