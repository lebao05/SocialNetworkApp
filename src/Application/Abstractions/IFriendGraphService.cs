using Application.DTOs.Friends;

namespace Application.Abstractions
{
    public interface IFriendGraphService
    {
        Task SyncUserAsync(Guid userId, string userName, string firstName, string lastName, string? avatarUrl);
        Task DeleteUserAsync(Guid userId);
        Task SyncFriendshipAsync(Guid user1Id, Guid user2Id);
        Task DeleteFriendshipAsync(Guid user1Id, Guid user2Id);
        
        Task<List<FriendResponse>> GetFriendRecommendationsAsync(Guid userId, int limit = 10);
        Task<List<FriendResponse>> GetMutualFriendsAsync(Guid userId, Guid otherUserId);
        Task<int> GetMutualFriendCountAsync(Guid userId, Guid otherUserId, CancellationToken cancellationToken = default);
        Task<List<FriendResponse>> GetShortestPathAsync(Guid startUserId, Guid endUserId);
    }
}
