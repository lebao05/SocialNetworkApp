using Application.Shared;
using Domain.Entities;

namespace Application.Abstractions.Repositories
{
    public interface IConversationRepository
    {
        Task AddAsync(Conversation conversation, CancellationToken cancellationToken = default);
        Task<bool> ExistsAsync(long id, CancellationToken cancellationToken = default);

        Task<Conversation?> GetByIdAsync(long id, CancellationToken cancellationToken = default);
        Task<ConversationMember?> GetMemberAsync(
        long conversationId,
        Guid userId,
        CancellationToken cancellationToken = default);
        Task<List<Conversation>> GetPagedConversationsAsync(
            Guid userId,
            int pageNumber,
            int pageSize,
            bool groupsOnly = false,
            bool unreadOnly = false,
            CancellationToken cancellationToken = default);
        Task<List<long>> GetAllConversationIdsAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<Conversation?> GetOneToOneConversationAsync(
            Guid userId1,
            Guid userId2,
            CancellationToken cancellationToken);
        Task<List<Conversation>> SearchGroupConversationsAsync(
            Guid userId,
            string term,
            int pageNumber,
            int pageSize,
            CancellationToken cancellationToken);
        Task<List<Conversation>> SearchOneToOneConversationsAsync(
            Guid userId,
            string term,
            int pageNumber,
            int pageSize,
            CancellationToken cancellationToken);
        Task<List<Guid>> GetMemberIdsAsync(long conversationId, CancellationToken cancellationToken);

        /// <summary>
        /// Checks if the current user has blocked the target user.
        /// "Am I blocking them?"
        /// </summary>
        Task<bool> IsBlockingUserAsync(Guid currentUserId, Guid targetUserId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Checks if the current user has been blocked by the target user.
        /// "Are they blocking me?"
        /// </summary>
        Task<bool> IsBlockedByUserIdAsync(Guid currentUserId, Guid targetUserId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Adds a block entry: <paramref name="currentUserId"/> blocks <paramref name="targetUserId"/>.
        /// Returns false if the user is already blocked.
        /// </summary>
        Task<bool> AddBlockAsync(Guid currentUserId, Guid targetUserId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Removes a block entry. Returns false if the user wasn't blocked.
        /// </summary>
        Task<bool> RemoveBlockAsync(Guid currentUserId, Guid targetUserId, CancellationToken cancellationToken = default);
    }
}
