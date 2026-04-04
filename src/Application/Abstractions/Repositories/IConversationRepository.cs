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
        Task<List<Conversation>> GetConversationsByUserIdAsync(
            Guid userId,
            CancellationToken cancellationToken = default);
    }
}
