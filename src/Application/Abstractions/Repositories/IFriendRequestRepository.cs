using Application.Shared;
using Domain.Entities;

namespace Application.Abstractions.Repositories
{
    public interface IFriendRequestRepository
    {
        Task<FriendRequest?> GetByIdAsync(long id);

        Task<FriendRequest?> GetPendingRequestAsync(Guid senderId, Guid receiverId);

        Task<FriendRequest?> GetBySenderAndReceiverAsync(Guid senderId, Guid receiverId);

        Task<bool> ExistsPendingRequestAsync(Guid senderId, Guid receiverId);

        Task<HashSet<Guid>> GetPendingRecipientIdsAsync(Guid senderId, IEnumerable<Guid> candidateReceiverIds, CancellationToken cancellationToken = default);

        Task<PagedList<FriendRequest>> GetIncomingPendingAsync(
            Guid receiverId,
            int page,
            int pageSize,
            CancellationToken cancellationToken = default);

        Task AddAsync(FriendRequest request);

        void Update(FriendRequest request);
    }
}
