using Application.Shared;
using Domain.Entities;

namespace Application.Abstractions.Repositories
{
    public interface IFriendshipRepository
    {
        Task<bool> ExistsAsync(Guid user1Id, Guid user2Id, CancellationToken cancellationToken = default);
        Task<bool> ExistsFollowingAsync(Guid followerId, Guid followeeId, CancellationToken cancellationToken);

        Task AddAsync(Friendship friendship);
        Task AddFollowingAsync(Following following);
        Task RemoveFollowingAsync(Guid followerId, Guid followeeId, CancellationToken cancellationToken);
        Task<List<User>> GetFriendsAsync(Guid userId, CancellationToken cancellationToken);
        Task<PagedList<User>> GetFriendsPagedAsync(Guid userId, int page, int pageSize, string? searchTerm = null, CancellationToken cancellationToken = default);
        Task<List<Friendship>> GetAllFriendshipsAsync(CancellationToken cancellationToken = default);
        Task<List<User>> SearchFriendsToChatAsync(
            Guid userId,
            string term,
            int pageNumber,
            int pageSize,
            CancellationToken cancellationToken);
        Task<List<User>> GetFolloweesAsync(Guid userId, CancellationToken cancellationToken);
        Task RemoveFriendshipAsync(Guid user1Id, Guid user2Id, CancellationToken cancellationToken);
    }
}
