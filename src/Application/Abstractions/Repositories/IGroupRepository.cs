using Domain.Entities;

namespace Application.Abstractions.Repositories
{
    public interface IGroupRepository
    {
        Task<Group?> GetByIdAsync(long id, CancellationToken cancellationToken);
        Task<Group?> GetByIdWithMembersAsync(long id, CancellationToken cancellationToken);
        void Add(Group group);
        Task<bool> IsUserInGroupAsync(Guid userId, long groupId, CancellationToken cancellationToken = default);
    }
}
