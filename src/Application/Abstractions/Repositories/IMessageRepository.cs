using Domain.Entities;

namespace Application.Abstractions.Repositories
{
    public interface IMessageRepository
    {
        void Add(Message message);
        Task<Message?> GetByIdAsync(long id, CancellationToken cancellationToken);
        Task<List<Message>> SearchMessagesAsync(long conversationId, string searchHash, CancellationToken cancellationToken);
        Task<List<Message>> GetMessagesAroundAsync(long conversationId, long? anchorMessageId, string direction, int size, CancellationToken cancellationToken);
        void Update(Message message);
    }
}
