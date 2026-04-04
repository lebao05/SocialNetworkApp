using Domain.Entities;

namespace Application.Abstractions.Repositories
{
    public interface IMessageRepository
    {
        void Add(Message message);
    }
}
