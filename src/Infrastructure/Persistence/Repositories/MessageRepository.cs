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

        public async Task<Message?> GetByIdWithIncludesAsync(long id, CancellationToken cancellationToken)
        {
            return await _context.Messages
                .AsNoTracking()
                .Include(m => m.Creator)
                .Include(m => m.Attachment)
                .Include(m => m.Reactions).ThenInclude(r => r.User)
                .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
        }

        public async Task<List<Message>> SearchMessagesAsync(long conversationId, string searchTerm, int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            return await _context.Messages
                .FromSqlInterpolated(
                    $"""
                    SELECT m.*
                    FROM "Messages" m
                    WHERE m."ConversationId" = {conversationId}
                      AND m."DeletedAt" IS NULL
                      AND m."SearchVector" @@ plainto_tsquery('english', {searchTerm})
                    ORDER BY m."CreatedAt" DESC
                    LIMIT {pageSize} OFFSET {((pageNumber - 1) * pageSize)}
                    """)
                .Include(m => m.Creator)
                .Include(m => m.Attachment)
                .Include(m => m.Reactions).ThenInclude(r => r.User)
                .AsNoTracking()
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
                .Include(m => m.Reactions).ThenInclude(r => r.User);

            if (direction.ToLower() == "up")
            {
                if (anchorMessageId.HasValue)
                    query = query.Where(m => m.Id < anchorMessageId.Value);

                return await query
                    .OrderBy(m => m.Id)
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
                    .Take(half)
                    .ToListAsync(cancellationToken);

                var down = await query
                    .Where(m => m.Id > anchorMessageId.Value)
                    .Take(half)
                    .ToListAsync(cancellationToken);

                var result = up.Concat(down).ToList();
                if (anchorMessage != null) result.Add(anchorMessage);

                return result.OrderBy(m => m.Id).ToList();
            }
        }

        public void Update(Message message)
        {
            _context.Messages.Update(message);
        }

        public async Task<List<Message>> GetFilesByConversationIdAsync(
            long conversationId,
            bool isMedia,
            int pageNumber,
            int pageSize,
            CancellationToken cancellationToken)
        {
            IQueryable<Message> query = _context.Messages
                .Where(m => m.ConversationId == conversationId && m.DeletedAt == null && m.Attachment != null)
                .AsNoTracking()
                .Include(m => m.Creator)
                .Include(m => m.Attachment)
                .Include(m => m.Reactions).ThenInclude(r => r.User)
                .OrderByDescending(m => m.CreatedAt);

            if (isMedia)
            {
                query = query.Where(m => m.MessageType == Domain.Enums.MessageType.Image || m.MessageType == Domain.Enums.MessageType.Video);
            }
            else
            {
                query = query.Where(m => m.MessageType != Domain.Enums.MessageType.Image &&
                                         m.MessageType != Domain.Enums.MessageType.Video &&
                                         m.MessageType != Domain.Enums.MessageType.Audio);
            }

            return await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Message>> GetPinnedMessagesAsync(
            long conversationId,
            int pageNumber,
            int pageSize,
            CancellationToken cancellationToken)
        {
            return await _context.Messages
                .Where(m => m.ConversationId == conversationId && m.IsPinned && m.DeletedAt == null)
                .AsNoTracking()
                .Include(m => m.Creator)
                .Include(m => m.Attachment)
                .Include(m => m.Reactions).ThenInclude(r => r.User)
                .OrderByDescending(m => m.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);
        }
    }
}
