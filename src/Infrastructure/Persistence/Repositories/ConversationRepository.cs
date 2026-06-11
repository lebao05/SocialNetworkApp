using Application.Abstractions.Repositories;
using Application.Shared;
using Domain.Entities;
using Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public class ConversationRepository : IConversationRepository
    {
        private readonly AppDbContext _context;

        public ConversationRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task AddAsync(Conversation conversation, CancellationToken cancellationToken = default)
        {
            await _context.Set<Conversation>().AddAsync(conversation, cancellationToken);
        }

        public async Task<bool> ExistsAsync(long id, CancellationToken cancellationToken = default)
        {
            return await _context.Conversations.AnyAsync(c => c.Id == id && c.DeletedAt == null, cancellationToken);
        }
        public async Task<global::Domain.Entities.Conversation?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
        {
            return await _context.Conversations
                .Include(c => c.Members)
                    .ThenInclude(m => m.User)
                .Include(c => c.Messages)
                .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null, cancellationToken);
        }
        public async Task<ConversationMember?> GetMemberAsync(
            long conversationId,
            Guid userId,
            CancellationToken cancellationToken = default)
        {
            return await _context.ConversationMembers
                .FirstOrDefaultAsync(m =>
                    m.ConversationId == conversationId &&
                    m.UserId == userId,
                    cancellationToken);
        }
        public async Task<List<Conversation>> GetPagedConversationsAsync(
                Guid userId,
                int pageNumber,
                int pageSize,
                CancellationToken cancellationToken = default)
        {
            // 1. Paginated conversations — no messages loaded yet
            var conversationIds = await _context.ConversationMembers
                .AsNoTracking()
                .Where(m => m.UserId == userId)
                .Select(m => m.ConversationId)
                .ToListAsync(cancellationToken);

            var paginatedIds = conversationIds
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            if (!paginatedIds.Any())
                return new List<Conversation>();

            // 2. Load conversations with members (no bloated messages include)
            var conversations = await _context.Conversations
                .AsNoTracking()
                .Include(c => c.Members).ThenInclude(m => m.User)
                .Where(c => c.DeletedAt == null && paginatedIds.Contains(c.Id))
                .ToListAsync(cancellationToken);

            // 3. Attach only the latest message per conversation via EF change tracker
            var latestMessages = await _context.Messages
                .Where(m => paginatedIds.Contains(m.ConversationId))
                .GroupBy(m => m.ConversationId)
                .Select(g => new { ConversationId = g.Key, LatestMessageId = g.Max(m => m.Id) })
                .ToListAsync(cancellationToken);

            var latestMsgIds = latestMessages.Select(x => x.LatestMessageId).ToList();

            var latestMessagesByConv = await _context.Messages
                .Where(m => latestMsgIds.Contains(m.Id))
                .ToListAsync(cancellationToken);

            foreach (var conv in conversations)
            {
                var latest = latestMessagesByConv.FirstOrDefault(m =>
                    latestMessages.Any(x => x.ConversationId == conv.Id && x.LatestMessageId == m.Id));

                if (latest != null)
                {
                    var entry = _context.Entry(conv);
                    if (!entry.Collection("Messages").IsLoaded)
                        entry.Collection("Messages").CurrentValue = new List<Message> { latest };
                }
            }

            return conversations
                .OrderByDescending(c => c.Messages.FirstOrDefault()?.CreatedAt ?? c.CreatedAt)
                .ToList();
        }

        public async Task<List<long>> GetAllConversationIdsAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return await _context.ConversationMembers
                .AsNoTracking()
                .Where(m => m.UserId == userId)
                .Select(m => m.ConversationId)
                .ToListAsync(cancellationToken);
        }

        public async Task<Conversation?> GetOneToOneConversationAsync(
            Guid userId1,
            Guid userId2,
            CancellationToken cancellationToken)
        {
            return await _context.Conversations
                .Include(c => c.Members)
                    .ThenInclude(m => m.User)
                .Include(c => c.Messages)
                .Where(c => c.IsOneToOne && c.DeletedAt == null)
                .Where(c => c.Members.Any(m => m.UserId == userId1) && c.Members.Any(m => m.UserId == userId2))
                .FirstOrDefaultAsync(cancellationToken);
        }

        public async Task<List<Conversation>> SearchGroupConversationsAsync(
            Guid userId,
            string term,
            int pageNumber,
            int pageSize,
            CancellationToken cancellationToken)
        {
            var lowerTerm = term.ToLower();

            return await _context.Conversations
                .AsNoTracking()
                .Include(c => c.Members)
                    .ThenInclude(m => m.User)
                .Include(c => c.Messages)
                .Where(c => !c.IsOneToOne && c.DeletedAt == null && c.Members.Any(m => m.UserId == userId))
                .Where(c => c.Name != null && c.Name.ToLower().Contains(lowerTerm))
                .OrderByDescending(c => c.Messages.Any() ? c.Messages.Max(m => m.CreatedAt) : c.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Conversation>> SearchOneToOneConversationsAsync(
            Guid userId,
            string term,
            int pageNumber,
            int pageSize,
            CancellationToken cancellationToken)
        {
            var lowerTerm = term.ToLower();

            return await _context.Conversations
                .AsNoTracking()
                .Include(c => c.Members)
                    .ThenInclude(m => m.User)
                .Include(c => c.Messages)
                .Where(c => c.IsOneToOne && c.DeletedAt == null && c.Members.Any(m => m.UserId == userId))
                .Where(c => c.Members.Any(m =>
                    m.UserId != userId &&
                    (m.User.FirstName.ToLower().Contains(lowerTerm) ||
                     m.User.LastName.ToLower().Contains(lowerTerm))))
                .OrderByDescending(c => c.Messages.Any() ? c.Messages.Max(m => m.CreatedAt) : c.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Guid>> GetMemberIdsAsync(
            long conversationId,
            CancellationToken cancellationToken)
        {
            return await _context.ConversationMembers
                .AsNoTracking()
                .Where(m => m.ConversationId == conversationId)
                .Select(m => m.UserId)
                .ToListAsync(cancellationToken);
        }
    }
}
