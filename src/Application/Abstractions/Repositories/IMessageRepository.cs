using Domain.Entities;

namespace Application.Abstractions.Repositories
{
    public interface IMessageRepository
    {
        void Add(Message message);
        Task<Message?> GetByIdAsync(long id, CancellationToken cancellationToken);
        Task<List<Message>> GetMessagesAroundAsync(long conversationId, long? anchorMessageId, string direction, int size, CancellationToken cancellationToken);
        void Update(Message message);

        Task<MessageReaction?> GetMessageReactionAsync(long messageId, Guid userId, CancellationToken cancellationToken);
        void AddReaction(MessageReaction reaction);
        void RemoveReaction(MessageReaction reaction);
        Task<List<Message>> GetFilesByConversationIdAsync(
            long conversationId,
            bool isMedia,
            int pageNumber,
            int pageSize,
            CancellationToken cancellationToken);

        Task<List<Message>> GetPinnedMessagesAsync(
            long conversationId,
            int pageNumber,
            int pageSize,
            CancellationToken cancellationToken);

        Task<List<Message>> SearchMessagesAsync(
            long conversationId,
            string searchTerm,
            int pageNumber,
            int pageSize,
            CancellationToken cancellationToken);
    }
}
