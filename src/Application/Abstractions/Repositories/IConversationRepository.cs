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
            CancellationToken cancellationToken);
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
    }
}
