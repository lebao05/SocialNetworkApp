using Application.Abstractions.Repositories;
using Application.Abstractions.SignalR;
using Application.DTOs.Search;
using Application.Shared;
using Domain.Entities;
using Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;
using NpgsqlTypes;
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

        public async Task<PagedList<SearchUserDto>> SearchAsync(string? searchQuery, Guid? currentUserId, int page, int pageSize, CancellationToken cancellationToken = default)
        {
            var query = _context.Users.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                query = query.Where(u => EF.Property<NpgsqlTsVector>(u, "SearchVector").Matches(EF.Functions.PlainToTsQuery("english", searchQuery)));
            }

            var users = await query
                .OrderBy(u => u.FirstName)
                .ThenBy(u => u.LastName)
                .ThenBy(u => u.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            var userIds = users.Select(u => u.Id).ToList();

            // Mutual friend counts
            Dictionary<Guid, int> mutualCounts = new();
            if (currentUserId.HasValue)
            {
                var friendships = await _context.Friendships
                    .AsNoTracking()
                    .Where(f => (f.User1Id == currentUserId.Value || f.User2Id == currentUserId.Value) && userIds.Contains(f.User1Id == currentUserId.Value ? f.User2Id : f.User1Id))
                    .ToListAsync(cancellationToken);

                var friendIds = friendships
                    .SelectMany(f => new[] { f.User1Id, f.User2Id })
                    .Where(id => id != currentUserId.Value && userIds.Contains(id))
                    .ToList();

                mutualCounts = friendIds
                    .GroupBy(id => id)
                    .ToDictionary(g => g.Key, g => g.Count());
            }

            var dtos = users.Select(u => new SearchUserDto(
                u.Id,
                u.FirstName,
                u.LastName,
                u.AvatarUrl,
                mutualCounts.GetValueOrDefault(u.Id)
            )).ToList();

            var totalCount = await query.CountAsync(cancellationToken);

            return new PagedList<SearchUserDto>(dtos, page, pageSize, totalCount);
        }
    }
}
