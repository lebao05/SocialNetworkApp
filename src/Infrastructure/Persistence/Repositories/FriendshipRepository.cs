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
                .Where(f => f.User1Id == userId )
                .Select(f => f.User2)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }
    }
}
