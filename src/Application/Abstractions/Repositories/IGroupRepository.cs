using Domain.Entities;
using Domain.Enums;
using Application.Shared;

namespace Application.Abstractions.Repositories
{
    public interface IGroupRepository
    {
        Task<Group?> GetByIdAsync(long id, CancellationToken cancellationToken);
        Task<Group?> GetByIdWithMembersAsync(long id, CancellationToken cancellationToken);
        Task<PagedList<GroupMember>> GetMembersPagedAsync(long groupId, int page, int pageSize, string? searchTerm = null, GroupMemberRole? role = null, CancellationToken cancellationToken = default);
        Task<PagedList<GroupJoinRequest>> GetJoinRequestsPagedAsync(long groupId, int page, int pageSize, string? searchTerm = null, GroupRequestStatus status = GroupRequestStatus.Pending, CancellationToken cancellationToken = default);
        void Add(Group group);
        Task<bool> IsUserInGroupAsync(Guid userId, long groupId, CancellationToken cancellationToken = default);
    }
}
