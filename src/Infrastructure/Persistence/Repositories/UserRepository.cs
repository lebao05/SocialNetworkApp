using Application.Abstractions;
using Application.Abstractions.Repositories;
using Application.Abstractions.SignalR;
using Application.DTOs.Admin;
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

        // ---- Admin dashboard aggregates ----

        public Task<long> GetTotalCountAsync(CancellationToken cancellationToken = default)
        {
            // Count() translates to SELECT count(*) — no entity materialization.
            return _context.Users.AsNoTracking().LongCountAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<DailyCountDto>> GetRegistrationSeriesAsync(
            DateTime fromUtc,
            DateTime toUtc,
            CancellationToken cancellationToken = default)
        {
            // Group by CreatedAt.Date so EF/SQL gives us one row per day.
            // The index IX_AspNetUsers_CreatedAt added in AddUserCreatedAt
            // migration makes the WHERE CreatedAt >= @from AND < @to a range scan.
            var raw = await _context.Users
                .AsNoTracking()
                .Where(u => u.CreatedAt >= fromUtc && u.CreatedAt < toUtc)
                .GroupBy(u => u.CreatedAt.Date)
                .Select(g => new DailyCountDto(DateOnly.FromDateTime(g.Key), g.Count()))
                .ToListAsync(cancellationToken);

            return raw;
        }

        // ---- Admin moderation ----

        public async Task<PagedList<AdminUserRowDto>> SearchAdminAsync(
            string? searchQuery,
            string? status,
            string? role,
            int page,
            int pageSize,
            CancellationToken cancellationToken = default)
        {
            // ── Base query ──────────────────────────────────────────────
            // Pull only the columns we project out so EF doesn't materialise
            // the entire AspNetUsers row.
            var users = _context.Users
                .AsNoTracking();

            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                users = users.Where(user => EF.Property<NpgsqlTsVector>(user, "SearchVector").Matches(EF.Functions.PlainToTsQuery("english", searchQuery)));
            }
            var query = users.Select(u => new
            {
                u.Id,
                u.Email,
                u.FirstName,
                u.LastName,
                u.AvatarUrl,
                u.IsLocked,
                u.CreatedAt,
                PostCount = _context.Posts.Count(p =>
                    p.AuthorId == u.Id &&
                    p.DeletedAt == null)
            });
            // ── Status filter ────────────────────────────────────────────
            if (string.Equals(status, "locked",   StringComparison.OrdinalIgnoreCase)) query = query.Where(u =>  u.IsLocked);
            if (string.Equals(status, "unlocked", StringComparison.OrdinalIgnoreCase)) query = query.Where(u => !u.IsLocked);

            // ── Role filter ──────────────────────────────────────────────
            // "admin" = user has the ADMIN role. "user" = has USER but NOT ADMIN.
            // We check AspNetUserRoles via the Identity tables exposed by the base DbContext.
            if (!string.IsNullOrWhiteSpace(role))
            {
                if (string.Equals(role, "admin", StringComparison.OrdinalIgnoreCase))
                {
                    query = query.Where(u =>
                        _context.UserRoles.Any(ur => ur.UserId == u.Id && ur.RoleId == _context.Roles
                            .Where(r => r.NormalizedName == "ADMIN")
                            .Select(r => r.Id)
                            .FirstOrDefault()));
                }
                else if (string.Equals(role, "moderator", StringComparison.OrdinalIgnoreCase))
                {
                    query = query.Where(u =>
                        _context.UserRoles.Any(ur => ur.UserId == u.Id && ur.RoleId == _context.Roles
                            .Where(r => r.NormalizedName == "MODERATOR")
                            .Select(r => r.Id)
                            .FirstOrDefault()));
                }
                else
                {
                    // "user" — has USER role but not ADMIN.
                    query = query.Where(u =>
                        _context.UserRoles.Any(ur => ur.UserId == u.Id && ur.RoleId == _context.Roles
                            .Where(r => r.NormalizedName == "USER")
                            .Select(r => r.Id)
                            .FirstOrDefault())
                        &&
                        !_context.UserRoles.Any(ur => ur.UserId == u.Id && ur.RoleId == _context.Roles
                            .Where(r => r.NormalizedName == "ADMIN")
                            .Select(r => r.Id)
                            .FirstOrDefault()));
                }
            }

            // ── Page + project ───────────────────────────────────────────
            var projected = query
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new AdminUserRowDto(
                    u.Id,
                    u.Email ?? string.Empty,
                    u.FirstName,
                    u.LastName,
                    u.AvatarUrl,
                    u.IsLocked,
                    // IsAdmin resolved per-row from the join (already in the
                    // query shape — this is one extra EXISTS-like subquery).
                    _context.UserRoles.Any(ur => ur.UserId == u.Id && ur.RoleId == _context.Roles
                        .Where(r => r.NormalizedName == "ADMIN")
                        .Select(r => r.Id)
                        .FirstOrDefault()),
                    u.PostCount,
                    u.CreatedAt,
                    // LastActive: users don't track LastLoginAt in our schema;
                    // fall back to CreatedAt so the column is always populated.
                    u.CreatedAt));

            return await PagedList<AdminUserRowDto>.CreateAsync(
                projected, page, pageSize, cancellationToken);
        }

        public async Task<bool> SetLockedAsync(
            Guid userId,
            bool isLocked,
            CancellationToken cancellationToken = default)
        {
            // Update is a single SQL UPDATE — no entity materialisation.
            // We return rows affected so the caller can detect a missing user.
            var affected = await _context.Users
                .Where(u => u.Id == userId)
                .ExecuteUpdateAsync(s => s.SetProperty(u => u.IsLocked, isLocked),
                    cancellationToken);
            return affected > 0;
        }

        public async Task<IReadOnlyDictionary<Guid, string>> GetDisplayNamesByIdsAsync(
            IReadOnlyCollection<Guid> userIds,
            CancellationToken cancellationToken = default)
        {
            // Empty input → empty result, no query.
            if (userIds is null || userIds.Count == 0)
                return new Dictionary<Guid, string>();

            var distinctIds = userIds.Distinct().ToList();

            // Single query — pulls only the four columns we need and projects
            // straight to the dictionary so EF doesn't materialise full users.
            var rows = await _context.Users
                .AsNoTracking()
                .Where(u => distinctIds.Contains(u.Id))
                .Select(u => new { u.Id, u.FirstName, u.LastName })
                .ToListAsync(cancellationToken);

            var result = new Dictionary<Guid, string>(rows.Count);
            foreach (var r in rows)
            {
                var name = (r.FirstName + " " + r.LastName).Trim();
                result[r.Id] = string.IsNullOrEmpty(name) ? "User" : name;
            }
            return result;
        }
    }
}
