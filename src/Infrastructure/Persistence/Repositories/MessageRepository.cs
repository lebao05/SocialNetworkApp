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

        public async Task<MessageReaction?> GetMessageReactionAsync(long messageId, Guid userId, CancellationToken cancellationToken)
        {
            return await _context.Set<MessageReaction>()
                .FirstOrDefaultAsync(r => r.MessageId == messageId && r.UserId == userId, cancellationToken);
        }

        public void AddReaction(MessageReaction reaction)
        {
            _context.Set<MessageReaction>().Add(reaction);
        }

        public void RemoveReaction(MessageReaction reaction)
        {
            _context.Set<MessageReaction>().Remove(reaction);
        }

        public async Task<List<Message>> GetFilesByConversationIdAsync(
            long conversationId,
            bool isMedia,
            int pageNumber,
            int pageSize,
            CancellationToken cancellationToken)
        {
            var mediaTypes = new[] { "image/", "video/" };

            return await _context.Messages
                .AsNoTracking()
                .Include(m => m.Creator)
                .Include(m => m.Attachment)
                .Include(m => m.MemberMessages)
                .Where(m => m.ConversationId == conversationId && m.DeletedAt == null && m.Attachment != null)
                .Where(m => isMedia
                    ? mediaTypes.Any(t => m.Attachment != null && m.Attachment.FileType.ToLower().StartsWith(t))
                    : !mediaTypes.Any(t => m.Attachment != null && m.Attachment.FileType.ToLower().StartsWith(t)) &&
                      m.Attachment != null && !m.Attachment.FileType.ToLower().StartsWith("audio/"))
                .OrderByDescending(m => m.CreatedAt)
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
                .AsNoTracking()
                .Include(m => m.Creator)
                .Include(m => m.Attachment)
                .Include(m => m.MemberMessages)
                .Where(m => m.ConversationId == conversationId && m.IsPinned && m.DeletedAt == null)
                .OrderByDescending(m => m.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Message>> SearchMessagesAsync(
            long conversationId,
            string searchTerm,
            int pageNumber,
            int pageSize,
            CancellationToken cancellationToken)
        {
            var safeTerm = searchTerm.Replace("'", "''");
            var offset = (pageNumber - 1) * pageSize;

            var sql = $@"
                SELECT m.""Id"", m.""ConversationId"", m.""CreatorId"", m.""Content"",
                       m.""ReplyToMessageId"", m.""ForwardFromMessageId"", m.""MessageType"",
                       m.""IsSystemMessage"", m.""Payload"", m.""IsPinned"",
                       m.""CreatedAt"", m.""UpdatedAt"", m.""DeletedAt""
                FROM ""Messages"" m
                WHERE m.""ConversationId"" = {conversationId}
                  AND m.""DeletedAt"" IS NULL
                  AND m.""SearchVector"" @@ plainto_tsquery('english', '{safeTerm}')
                ORDER BY m.""CreatedAt"" DESC
                OFFSET {offset} ROWS FETCH NEXT {pageSize} ROWS ONLY";

            var ids = await _context.Database
                .SqlQueryRaw<long>(sql)
                .ToListAsync(cancellationToken);

            if (ids.Count == 0)
                return new List<Message>();

            return await _context.Messages
                .AsNoTracking()
                .Include(m => m.Creator)
                .Include(m => m.Attachment)
                .Include(m => m.MemberMessages)
                .Where(m => ids.Contains(m.Id))
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync(cancellationToken);
        }
    }
}
