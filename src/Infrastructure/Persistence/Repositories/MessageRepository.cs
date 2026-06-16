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

        public async Task<MessagesAroundResult> GetMessagesAroundAsync(
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

                // Request size + 1 to detect if more exist above
                var res = await query
                    .OrderByDescending(m => m.Id)
                    .Take(size + 1)
                    .ToListAsync(cancellationToken);

                var hasMoreUp = res.Count > size;
                if (hasMoreUp) res = res.Take(size).ToList();

                return new MessagesAroundResult(
                    Messages: res.OrderBy(m => m.Id).ToList(),
                    HasMoreUp: hasMoreUp,
                    HasMoreDown: false // unknown when only fetching older
                );
            }
            else if (direction.ToLower() == "down")
            {
                if (!anchorMessageId.HasValue) return new MessagesAroundResult(new List<Message>(), false, false);

                var res = await query
                    .Where(m => m.Id > anchorMessageId.Value)
                    .OrderBy(m => m.Id)
                    .Take(size + 1)
                    .ToListAsync(cancellationToken);

                var hasMoreDown = res.Count > size;
                if (hasMoreDown) res = res.Take(size).ToList();

                return new MessagesAroundResult(
                    Messages: res,
                    HasMoreUp: false, // unknown when only fetching newer
                    HasMoreDown: hasMoreDown
                );
            }
            else // "around"
            {
                if (!anchorMessageId.HasValue)
                {
                    // No anchor: return the latest `size` messages (newest down direction)
                    var res = await GetMessagesAroundAsync(conversationId, null, "down", size, cancellationToken);
                    // For "down" without anchor above, treat as bottom - hasMoreDown = false
                    return new MessagesAroundResult(res.Messages, res.HasMoreUp, false);
                }

                var anchorMessage = await query.FirstOrDefaultAsync(m => m.Id == anchorMessageId.Value, cancellationToken);

                var half = size / 2;

                // Fetch size + 1 to detect more
                var up = await query
                    .Where(m => m.Id < anchorMessageId.Value)
                    .OrderByDescending(m => m.Id)
                    .Take(half + 1)
                    .ToListAsync(cancellationToken);

                var hasMoreUp = up.Count > half;
                if (hasMoreUp) up = up.Take(half).ToList();

                var down = await query
                    .Where(m => m.Id > anchorMessageId.Value)
                    .OrderBy(m => m.Id)
                    .Take(half + 1)
                    .ToListAsync(cancellationToken);

                var hasMoreDown = down.Count > half;
                if (hasMoreDown) down = down.Take(half).ToList();

                var result = up.Concat(down).ToList();
                if (anchorMessage != null) result.Add(anchorMessage);

                return new MessagesAroundResult(
                    Messages: result.OrderBy(m => m.Id).ToList(),
                    HasMoreUp: hasMoreUp,
                    HasMoreDown: hasMoreDown
                );
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
                // Media = messages with an image/video Attachment (filtered by MIME type)
                query = query.Where(m =>
                    m.Attachment != null &&
                    (m.Attachment.FileType.ToLower().StartsWith("image/") ||
                     m.Attachment.FileType.ToLower().StartsWith("video/")));
            }
            else
            {
                // Files = messages with an Attachment that is NOT image/video/audio
                query = query.Where(m =>
                    m.Attachment != null &&
                    !m.Attachment.FileType.ToLower().StartsWith("image/") &&
                    !m.Attachment.FileType.ToLower().StartsWith("video/") &&
                    !m.Attachment.FileType.ToLower().StartsWith("audio/"));
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
