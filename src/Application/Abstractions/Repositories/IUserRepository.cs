using Application.Abstractions.Repositories;
using Application.DTOs.Admin;
using Application.DTOs.Posts;
using Application.DTOs.Search;
using Application.Shared;
using Domain.Entities;

namespace Application.Abstractions.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(Guid id,CancellationToken cancellationToken);
        Task<bool> ExistsAsync(Guid id,CancellationToken cancellationToken);
        Task<List<User>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<PagedList<User>> SearchUsersAsync(string? searchQuery, long? groupId, int pageNumber, int pageSize, CancellationToken cancellationToken = default);
        Task<List<string>> GetConnectionsAsync(Guid userId, CancellationToken cancellationToken);
        Task<PagedList<SearchUserDto>> SearchAsync(
            string? searchQuery,
            Guid currentUserId,
            int page,
            int pageSize,
            CancellationToken cancellationToken = default);

        // ---- Admin dashboard aggregates ----
        // All counts are pushed down to the database (no entity materialization).

        Task<long> GetTotalCountAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Returns the number of users registered on each UTC day in
        /// [<paramref name="fromUtc"/>, <paramref name="toUtc"/>). The result is
        /// gap-filled by the caller — this method only returns rows for days
        /// that actually had registrations.
        /// </summary>
        Task<IReadOnlyList<DailyCountDto>> GetRegistrationSeriesAsync(
            DateTime fromUtc,
            DateTime toUtc,
            CancellationToken cancellationToken = default);

        // ---- Admin moderation ----

        /// <summary>
        /// Paged list of users for the admin Users page. Filters:
        ///   - searchQuery: full-text on FirstName/LastName/Email via the
        ///     SearchVector shadow property (GIN-indexed).
        ///   - status: "locked" | "unlocked" | null/empty for all.
        ///   - role:   "admin" | "user" | "moderator" | null/empty for all.
        /// Posts count is computed at the DB to avoid N+1 queries.
        /// </summary>
        Task<PagedList<AdminUserRowDto>> SearchAdminAsync(
            string? searchQuery,
            string? status,
            string? role,
            int page,
            int pageSize,
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Toggles the IsLocked moderation flag. Returns false if the user
        /// doesn't exist (caller can translate to a 404).
        /// </summary>
        Task<bool> SetLockedAsync(
            Guid userId,
            bool isLocked,
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Batched display-name lookup. Returns a dictionary keyed by user id
        /// with the value being "{FirstName} {LastName}" — only includes users
        /// that actually exist (missing ids are silently dropped).
        ///
        /// Used to resolve tagged-user ids to names when reading posts.
        /// </summary>
        Task<IReadOnlyDictionary<Guid, string>> GetDisplayNamesByIdsAsync(
            IReadOnlyCollection<Guid> userIds,
            CancellationToken cancellationToken = default);
    }
}
