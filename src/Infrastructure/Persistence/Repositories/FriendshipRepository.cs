using Application.Abstractions.Repositories;
using Application.Shared;
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

        public async Task<bool> ExistsAsync(Guid user1Id, Guid user2Id, CancellationToken cancellationToken = default)
        {
            return await _context.Friendships
                .AnyAsync(f =>
                    f.User1Id == user1Id &&
                    f.User2Id == user2Id, cancellationToken);
        }

        public async Task<bool> ExistsFollowingAsync(Guid followerId, Guid followeeId, CancellationToken cancellationToken)
        {
            return await _context.Followings
                .AnyAsync(f => f.FollowerId == followerId && f.FolloweeId == followeeId, cancellationToken);
        }

        public async Task AddAsync(Friendship friendship)
        {
            await _context.Friendships.AddAsync(friendship);
        }

        public async Task AddFollowingAsync(Following following)
        {
            await _context.Followings.AddAsync(following);
        }

        public async Task RemoveFollowingAsync(Guid followerId, Guid followeeId, CancellationToken cancellationToken)
        {
            var following = await _context.Followings
                .FirstOrDefaultAsync(f => f.FollowerId == followerId && f.FolloweeId == followeeId, cancellationToken);

            if (following is not null)
            {
                _context.Followings.Remove(following);
            }
        }

        public async Task<List<User>> GetFriendsAsync(Guid userId, CancellationToken cancellationToken)
        {
            return await _context.Friendships
                .Where(f => f.User1Id == userId || f.User2Id == userId)
                .Select(f => f.User1Id == userId ? f.User2 : f.User1)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<PagedList<User>> GetFriendsPagedAsync(
            Guid userId,
            int page,
            int pageSize,
            string? searchTerm = null,
            CancellationToken cancellationToken = default)
        {
            var query = _context.Friendships
                .Where(f => f.User1Id == userId || f.User2Id == userId)
                .Select(f => f.User1Id == userId ? f.User2 : f.User1)
                .AsNoTracking();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var term = searchTerm.Trim().ToLower();
                query = query.Where(u =>
                    (u.FirstName != null && u.FirstName.ToLower().Contains(term)) ||
                    (u.LastName != null && u.LastName.ToLower().Contains(term)));
            }

            return await PagedList<User>.CreateAsync(query, page, pageSize, cancellationToken);
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

        public async Task<List<Friendship>> GetAllFriendshipsAsync(CancellationToken cancellationToken = default)
        {
            return await _context.Friendships
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<List<User>> GetFolloweesAsync(Guid userId, CancellationToken cancellationToken)
        {
            return await _context.Followings
                .Where(f => f.FollowerId == userId)
                .Select(f => f.Followee)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task RemoveFriendshipAsync(Guid user1Id, Guid user2Id, CancellationToken cancellationToken)
        {
            var friendship = await _context.Friendships
                .FirstOrDefaultAsync(f =>
                    (f.User1Id == user1Id && f.User2Id == user2Id) ||
                    (f.User1Id == user2Id && f.User2Id == user1Id),
                    cancellationToken);

            if (friendship is not null)
            {
                _context.Friendships.Remove(friendship);
            }
        }
    }
}
