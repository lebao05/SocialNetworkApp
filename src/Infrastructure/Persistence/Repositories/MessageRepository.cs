using Application.Abstractions.Repositories;
using Domain.Entities;
using Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

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
        public async Task<Message?> GetByIdAsync(long id, CancellationToken cancellationToken)
        {
            return await _context.Messages
                .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
        }

        public async Task<List<Message>> SearchMessagesAsync(long conversationId, string searchHash, CancellationToken cancellationToken)
        {
            return await _context.Messages
                .Where(m => m.ConversationId == conversationId && 
                            m.DeletedAt == null && 
                            m.SearchContent != null && 
                            m.SearchContent.Contains(searchHash))
                .AsNoTracking()
                .Include(m => m.Creator)
                .Include(m => m.Attachment)
                .Include(m => m.MemberMessages)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Message>> GetMessagesAroundAsync(
            long conversationId, 
            long? anchorMessageId, 
            string direction, 
            int size, 
            CancellationToken cancellationToken)
        {
            IQueryable<Message> query = _context.Messages
                .Where(m => m.ConversationId == conversationId && m.DeletedAt == null)
                .AsNoTracking()
                .Include(m => m.Creator)
                .Include(m => m.Attachment)
                .Include(m => m.MemberMessages);

            if (direction.ToLower() == "up")
            {
                if (anchorMessageId.HasValue)
                    query = query.Where(m => m.Id < anchorMessageId.Value);
                
                return await query
                    .OrderByDescending(m => m.Id)
                    .Take(size)
                    .ToListAsync(cancellationToken);
            }
            else if (direction.ToLower() == "down")
            {
                // If anchor is null for "down", it doesn't make much sense (where is the start?), 
                // so we'll just return empty or from start. 
                if (!anchorMessageId.HasValue) return new List<Message>();

                return await query
                    .Where(m => m.Id > anchorMessageId.Value)
                    .OrderBy(m => m.Id)
                    .Take(size)
                    .ToListAsync(cancellationToken);
            }
            else // "around"
            {
                if (!anchorMessageId.HasValue) return await GetMessagesAroundAsync(conversationId, null, "up", size, cancellationToken);

                var anchorMessage = await query.FirstOrDefaultAsync(m => m.Id == anchorMessageId.Value, cancellationToken);
                
                var half = size / 2;
                
                var up = await query
                    .Where(m => m.Id < anchorMessageId.Value)
                    .OrderByDescending(m => m.Id)
                    .Take(half)
                    .ToListAsync(cancellationToken);

                var down = await query
                    .Where(m => m.Id > anchorMessageId.Value)
                    .OrderBy(m => m.Id)
                    .Take(half)
                    .ToListAsync(cancellationToken);

                var result = up.Concat(down).ToList();
                if (anchorMessage != null) result.Add(anchorMessage);
                
                return result.OrderByDescending(m => m.Id).ToList();
            }
        }

        public void Update(Message message)
        {
            _context.Messages.Update(message);
        }
    }
}
