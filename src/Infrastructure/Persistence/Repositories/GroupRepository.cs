using Application.Abstractions.Repositories;
using Domain.Entities;
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
                .FirstOrDefaultAsync(g => g.Id == id, cancellationToken);
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
