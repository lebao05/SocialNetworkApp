using Application.Abstractions.Repositories;
using Application.DTOs.Groups;
using Application.DTOs.Search;
using Application.Shared;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;
using NpgsqlTypes;

namespace Infrastructure.Persistence.Repositories
{
    public class GroupRepository : IGroupRepository
    {
        private readonly AppDbContext _context;

        public GroupRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Group?> GetByIdAsync(long id, CancellationToken cancellationToken)
        {
            return await _context.Groups
                .FirstOrDefaultAsync(g => g.Id == id, cancellationToken);
        }

        public async Task<Group?> GetByIdWithMembersAsync(long id, CancellationToken cancellationToken)
        {
            return await _context.Groups
                .Include(g => g.Members)
                .Include(g => g.Requests)
                .Include(g => g.Rules)
                .FirstOrDefaultAsync(g => g.Id == id, cancellationToken);
        }

        public async Task<PagedList<GroupMember>> GetMembersPagedAsync(
            long groupId,
            int page,
            int pageSize,
            string? searchTerm = null,
            GroupMemberRole? role = null,
            CancellationToken cancellationToken = default)
        {
            var query = _context.GroupMembers
                .AsNoTracking()
                .Include(member => member.User)
                .Where(member => member.GroupId == groupId);

            if (role.HasValue)
            {
                query = query.Where(member => member.Role == role.Value);
            }

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var normalizedSearch = searchTerm.Trim().ToLower();
                query = query.Where(member =>
                    member.User.FirstName.ToLower().Contains(normalizedSearch)
                    || member.User.LastName.ToLower().Contains(normalizedSearch)
                    || (member.User.FirstName + " " + member.User.LastName).ToLower().Contains(normalizedSearch)
                    || (member.User.Email != null && member.User.Email.ToLower().Contains(normalizedSearch)));
            }

            query = query
                .OrderBy(member => member.Role)
                .ThenBy(member => member.User.FirstName)
                .ThenBy(member => member.User.LastName);

            // If filtering by Moderator or Admin role, fetch all without pagination
            var effectivePageSize = (role == GroupMemberRole.Moderator || role == GroupMemberRole.Admin)
                ? 10000 // Fetch all
                : pageSize;

            return await PagedList<GroupMember>.CreateAsync(query, page, effectivePageSize, cancellationToken);
        }

        public async Task<PagedList<GroupJoinRequest>> GetJoinRequestsPagedAsync(
            long groupId,
            int page,
            int pageSize,
            string? searchTerm = null,
            DateTime? fromDate = null,
            bool? haveAvatar = null,
            GroupRequestStatus status = GroupRequestStatus.Pending,
            CancellationToken cancellationToken = default)
        {
            var query = _context.GroupJoinRequests
                .AsNoTracking()
                .Include(request => request.User)
                .Where(request => request.GroupId == groupId && request.Status == status);

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var normalizedSearch = searchTerm.Trim().ToLower();
                query = query.Where(request =>
                    request.User.FirstName.ToLower().Contains(normalizedSearch)
                    || request.User.LastName.ToLower().Contains(normalizedSearch)
                    || (request.User.FirstName + " " + request.User.LastName).ToLower().Contains(normalizedSearch));
            }

            if (fromDate.HasValue)
            {
                query = query.Where(request => request.CreatedAt >= fromDate.Value);
            }

            if (haveAvatar.HasValue)
            {
                if (haveAvatar.Value)
                {
                    query = query.Where(request => request.User.AvatarUrl != null && request.User.AvatarUrl != string.Empty);
                }
                else
                {
                    query = query.Where(request => request.User.AvatarUrl == null || request.User.AvatarUrl == string.Empty);
                }
            }

            query = query
                .OrderByDescending(request => request.CreatedAt)
                .ThenBy(request => request.User.FirstName)
                .ThenBy(request => request.User.LastName);

            return await PagedList<GroupJoinRequest>.CreateAsync(query, page, pageSize, cancellationToken);
        }

        public void Add(Group group)
        {
            _context.Groups.Add(group);
        }

        public async Task<bool> IsUserInGroupAsync(Guid userId, long groupId, CancellationToken cancellationToken = default)
        {
            return await _context.Groups
                .Where(g => g.Id == groupId)
                .AnyAsync(g => g.Members.Any(m => m.UserId == userId), cancellationToken);
        }

        public async Task<PagedList<GroupCardDto>> GetGroupsAsync(
            Guid currentUserId,
            bool isJoining,
            int page,
            int pageSize,
            string? searchTerm,
            CancellationToken cancellationToken = default)
        {
            var cutoff = DateTime.UtcNow.AddDays(-30);

            // 1. Define subquery expressions (These do NOT execute yet; they stay as IQueryable SQL definitions)
            var joinedGroupIds = _context.GroupMembers
                .Where(gm => gm.UserId == currentUserId)
                .Select(gm => gm.GroupId);

            var friendIds = _context.Friendships
                .Where(f => f.User1Id == currentUserId || f.User2Id == currentUserId)
                .Select(f => f.User1Id == currentUserId ? f.User2Id : f.User1Id)
                .Where(id => id != currentUserId);

            // 2. Prepare the primary source query
            var query = _context.Groups
                .AsNoTracking()
                .Where(g => isJoining ? joinedGroupIds.Contains(g.Id) : true);
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(g => EF.Property<NpgsqlTsVector>(g, "SearchVector").Matches(EF.Functions.PlainToTsQuery("english", searchTerm)));
            }
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var term = searchTerm.Trim().ToLower();
                query = query.Where(g => g.Name.ToLower().Contains(term));
            }

            // 3. Get the total matching count before pagination
            var totalCount = await query.CountAsync(cancellationToken);

            // 4. Project everything cleanly at the SQL server level
            var pagedQuery = query
                .OrderBy(g => g.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(g => new GroupCardDto(
                    g.Id,
                    g.Name,
                    g.CoverPhotoUrl,
                    g.PrivacyType.ToString(),
                    g.Members.Count,

                    // Inline Database Subquery: Post count over trailing 30 days
                    _context.Posts.Count(p => p.GroupId == g.Id && p.CreatedAt >= cutoff),

                    // Inline Database Subquery: Fetch up to 3 friend member records
                    g.Members
                        .Where(gm => friendIds.Contains(gm.UserId))
                        .Select(gm => new GroupCardMemberDto(
                            gm.UserId,
                            (gm.User.FirstName + " " + gm.User.LastName).Trim(),
                            gm.User.AvatarUrl
                        ))
                        .Take(3)
                        .ToList(),

                    // Inline Database Subquery: Total count of mutual friend members
                    g.Members.Count(gm => friendIds.Contains(gm.UserId))
                ));

            var cards = await pagedQuery.ToListAsync(cancellationToken);

            return new PagedList<GroupCardDto>(cards, page, pageSize, totalCount);
        }
    }
}
