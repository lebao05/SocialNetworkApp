using Domain.Entities;
namespace Application.Abstractions.Repositories
{
    public interface IFriendRequestRepository
    {
        Task<FriendRequest?> GetByIdAsync(long id);

        Task<bool> ExistsPendingRequestAsync(Guid senderId, Guid receiverId);

        Task AddAsync(FriendRequest request);
    }
}
