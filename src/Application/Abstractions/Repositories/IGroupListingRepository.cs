using Application.Abstractions.Repositories;
using Application.DTOs.Groups;
using Application.Shared;

namespace Application.Abstractions.Repositories;

public interface IGroupListingRepository
{
    /// <summary>
    /// Returns paginated group cards filtered by membership status.
    /// </summary>
    /// <param name="currentUserId">The current user's ID.</param>
    /// <param name="isJoining">When true, returns only groups the user has joined. When false, returns only groups the user has NOT joined.</param>
    Task<PagedList<GroupCardDto>> GetGroupsAsync(
        Guid currentUserId,
        bool isJoining,
        int page,
        int pageSize,
        string? searchTerm,
        CancellationToken cancellationToken = default);
}
