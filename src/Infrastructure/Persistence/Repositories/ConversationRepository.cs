using Application.Abstractions.Repositories;
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
        public async Task<List<Conversation>> GetConversationsByUserIdAsync(
            Guid userId,
            CancellationToken cancellationToken = default)
        {
            return await _context.Conversations
                .Where(c => c.Members.Any(m => m.UserId == userId) && !c.IsDeleted)
                .Include(c => c.Messages.OrderByDescending(m => m.CreatedAt).Take(1)) // Get last message info
                .ToListAsync(cancellationToken);
        }
    }
}
