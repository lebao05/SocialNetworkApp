using Domain.Entities;

namespace Application.Abstractions.Repositories
{
    public interface IFriendshipRepository
    {
        Task<bool> ExistsAsync(Guid user1Id, Guid user2Id);

        Task AddAsync(Friendship friendship);
    }
}
