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
            return await _context.Conversations.AnyAsync(c => c.Id == id && !c.IsDeleted, cancellationToken);
        }
        public async Task<global::Domain.Entities.Conversation?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
        {
            return await _context.Conversations
                .Include(c => c.Members) //
                .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted, cancellationToken);
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
        public async Task<PagedList<Conversation>> GetPagedConversationsAsync(
                Guid userId,
                int pageNumber,
                int pageSize,
                CancellationToken cancellationToken = default)
        {
            // 1. Create the base query with Eager Loading (Includes)
            // We MUST include Members, the User identity for those members, and Messages
            var query = _context.Conversations
                .AsNoTracking() // Recommended for Read-Only Queries
                .Include(c => c.Members)
                    .ThenInclude(m => m.User)
                .Include(c => c.Messages)
                .Where(c => !c.IsDeleted && c.Members.Any(m => m.UserId == userId))
                .OrderByDescending(c => c.Messages.Max(m => m.CreatedAt));

            // 2. Execute pagination logic
            var totalCount = await query.CountAsync(cancellationToken);

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return new PagedList<Conversation>(items, pageNumber, pageSize, totalCount);
        }
    }
}
