using Application.Abstractions.Repositories;
using Application.Abstractions.SignalR;
using Application.Shared;
using Domain.Entities;
using Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;
namespace Infrastructure.Persistence.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;
        private readonly IPresenceTracker _presenceTracker;

        public UserRepository(AppDbContext context, IPresenceTracker presenceTracker)
        {
            _context = context;
            _presenceTracker = presenceTracker;
        }

        public async Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        }

        public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _context.Users
                .AnyAsync(u => u.Id == id, cancellationToken);
        }

        public async Task<List<User>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _context.Users
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<PagedList<User>> SearchUsersAsync(string? searchQuery, long? groupId, int pageNumber, int pageSize, CancellationToken cancellationToken = default)
        {
            var query = _context.Users.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                var lowerQuery = searchQuery.ToLower();
                query = query.Where(u =>
                    u.FirstName.ToLower().Contains(lowerQuery) ||
                    u.LastName.ToLower().Contains(lowerQuery));
            }

            if (groupId.HasValue)
            {
                query = query.Where(u =>
                    u.GroupMemberships.Any(gm => gm.GroupId == groupId.Value));
            }

            query = query.OrderBy(u => u.FirstName).ThenBy(u => u.LastName);

            return await PagedList<User>.CreateAsync(query, pageNumber, pageSize, cancellationToken);
        }

        public Task<List<string>> GetConnectionsAsync(Guid userId, CancellationToken cancellationToken)
        {
            var connections = _presenceTracker.GetConnections(userId.ToString());
            return Task.FromResult(connections);
        }
    }
}
