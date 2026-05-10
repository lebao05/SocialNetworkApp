using Application.Abstractions.Repositories;
using Domain.Entities;
using Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;
namespace Infrastructure.Persistence.Repositories
{

    public class FriendshipRepository : IFriendshipRepository
    {
        private readonly AppDbContext _context;

        public FriendshipRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ExistsAsync(Guid user1Id, Guid user2Id)
        {
            // normalize (same logic as entity)
            if (user1Id.CompareTo(user2Id) > 0)
            {
                var temp = user1Id;
                user1Id = user2Id;
                user2Id = temp;
            }

            return await _context.Friendships
                .AnyAsync(f =>
                    f.User1Id == user1Id &&
                    f.User2Id == user2Id);
        }

        public async Task AddAsync(Friendship friendship)
        {
            await _context.Friendships.AddAsync(friendship);
        }
        public async Task<List<User>> GetFriendsAsync(Guid userId, CancellationToken cancellationToken)
        {
            return await _context.Friendships
                .Where(f => f.User1Id == userId || f.User2Id == userId)
                .Select(f => f.User1Id == userId ? f.User2 : f.User1)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<List<User>> SearchFriendsToChatAsync(
            Guid userId,
            string term,
            int pageNumber,
            int pageSize,
            CancellationToken cancellationToken)
        {
            var lowerTerm = term.ToLower();

            // 1. Get IDs of users who already have a 1:1 conversation with this user
            var existingConversationUserIds = _context.ConversationMembers
                .Where(m => m.UserId == userId)
                .Select(m => m.ConversationId)
                .Join(_context.Conversations.Where(c => c.IsOneToOne), 
                    cid => cid, 
                    c => c.Id, 
                    (cid, c) => c)
                .SelectMany(c => c.Members)
                .Where(m => m.UserId != userId)
                .Select(m => m.UserId);

            // 2. Query friends matching the term who are NOT in the existing conversations
            return await _context.Friendships
                .Where(f => f.User1Id == userId || f.User2Id == userId)
                .Select(f => f.User1Id == userId ? f.User2 : f.User1)
                .Where(u => u.FirstName.ToLower().Contains(lowerTerm) || u.LastName.ToLower().Contains(lowerTerm))
                .Where(u => !existingConversationUserIds.Contains(u.Id))
                .OrderBy(u => u.FirstName)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }
    }
}
