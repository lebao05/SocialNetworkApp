using Application.Abstractions;
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
        private readonly IFriendGraphService _friendGraphService;
        public UserRepository(AppDbContext context, IPresenceTracker presenceTracker, IFriendGraphService friendGraphService)
        {
            _context = context;
            _presenceTracker = presenceTracker;
            _friendGraphService = friendGraphService;
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

        public async Task<PagedList<SearchUserDto>> SearchAsync(
            string? searchQuery,
            Guid currentUserId,
            int page,
            int pageSize,
            CancellationToken cancellationToken = default)
        {
            var query = _context.Users.AsNoTracking();

            // 1. Apply Full-Text Search Vector if present
            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                query = query.Where(u => EF.Property<NpgsqlTsVector>(u, "SearchVector")
                    .Matches(EF.Functions.PlainToTsQuery("english", searchQuery)));
            }

            // 2. Fetch the total count BEFORE evaluating pagination limits
            var totalCount = await query.CountAsync(cancellationToken);

            // 3. Fetch only the paginated block of users into memory
            var users = await query
                .OrderBy(u => u.FirstName)
                .ThenBy(u => u.LastName)
                .ThenBy(u => u.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            if (users.Count == 0)
            {
                return new PagedList<SearchUserDto>(new List<SearchUserDto>(), page, pageSize, totalCount);
            }

            // 4. Generate the collection of internal async service tasks
            var tasks = users.Select(async u =>
            {
                var mutualCount = await _friendGraphService.GetMutualFriendCountAsync(currentUserId, u.Id);

                return new SearchUserDto(
                    u.Id,
                    u.FirstName,
                    u.LastName,
                    u.AvatarUrl,
                    mutualCount
                );
            });

            // 5. Await all generated worker tasks concurrently
            var dtos = (await Task.WhenAll(tasks)).ToList();

            return new PagedList<SearchUserDto>(dtos, page, pageSize, totalCount);
        }
    }
}
