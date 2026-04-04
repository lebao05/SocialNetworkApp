using Application.Abstractions.Repositories;
using Domain.Entities;
using Infrastructure.Persistence.Contexts;

namespace Infrastructure.Persistence.Repositories
{

    public class MessageRepository : IMessageRepository
    {

        private readonly AppDbContext _context;

        public MessageRepository(AppDbContext context) => _context = context;

        public void Add(Message message)
        {
            _context.Set<Message>().Add(message);
        }
    }
}
