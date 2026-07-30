using Application.DTOs.Admin;
using Application.DTOs.Groups;
using Application.DTOs.Search;
using Application.Shared;
using Domain.Entities;
using Domain.Enums;

namespace Application.Abstractions.Repositories;

public interface IGroupRepository
{
    Task<Group?> GetByIdAsync(long id, CancellationToken cancellationToken);
    Task<Group?> GetByIdWithMembersAsync(long id, CancellationToken cancellationToken);
    Task<PagedList<GroupMember>> GetMembersPagedAsync(long groupId, int page, int pageSize, string? searchTerm = null, GroupMemberRole? role = null, CancellationToken cancellationToken = default);
    Task<PagedList<GroupJoinRequest>> GetJoinRequestsPagedAsync(long groupId, int page, int pageSize, string? searchTerm = null, DateTime? fromDate = null, bool? haveAvatar = null, GroupRequestStatus status = GroupRequestStatus.Pending, CancellationToken cancellationToken = default);
    Task<PagedList<GroupCardDto>> GetGroupsAsync(Guid currentUserId, bool isJoining, int page, int pageSize, string? searchTerm, CancellationToken cancellationToken = default);
    void Add(Group group);
    Task<bool> IsUserInGroupAsync(Guid userId, long groupId, CancellationToken cancellationToken = default);

    // ---- Admin dashboard aggregate ----
    // Counts the groups that have had a post or join activity recently so the
    // "Active Groups" KPI reflects real engagement instead of total ever created.
    Task<long> GetActiveGroupCountAsync(CancellationToken cancellationToken = default);

    // ---- Admin moderation ----

    /// <summary>
    /// Paged list of groups for the admin Groups page. Filters:
    ///   - searchQuery: full-text on Name/Description via SearchVector.
    ///   - privacy: "public" | "private" | null/empty for all.
    ///   - status:  "locked" | "unlocked" | null/empty for all.
    /// Member count and post count are computed at the DB.
    /// </summary>
    Task<PagedList<AdminGroupRowDto>> SearchAdminAsync(
        string? searchQuery,
        string? privacy,
        string? status,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Toggles the IsLocked moderation flag. Returns false if the group
    /// doesn't exist (caller can translate to a 404).
    /// </summary>
    Task<bool> SetLockedAsync(
        long groupId,
        bool isLocked,
        CancellationToken cancellationToken = default);
}
