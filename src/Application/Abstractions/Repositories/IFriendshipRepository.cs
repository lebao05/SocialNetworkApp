using Domain.Entities;

namespace Application.Abstractions.Repositories
{
    public interface IFriendshipRepository
    {
        Task<bool> ExistsAsync(Guid user1Id, Guid user2Id);

        Task AddAsync(Friendship friendship);
        Task<List<User>> GetFriendsAsync(Guid userId, CancellationToken cancellationToken);
        Task<List<User>> SearchFriendsToChatAsync(
            Guid userId,
            string term,
            int pageNumber,
            int pageSize,
            CancellationToken cancellationToken);
    }
}
