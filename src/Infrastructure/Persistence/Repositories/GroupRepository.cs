using Application.Abstractions.Repositories;
using Application.Shared;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

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

            return await PagedList<GroupMember>.CreateAsync(query, page, pageSize, cancellationToken);
        }

        public async Task<PagedList<GroupJoinRequest>> GetJoinRequestsPagedAsync(
            long groupId,
            int page,
            int pageSize,
            string? searchTerm = null,
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
    }
}
