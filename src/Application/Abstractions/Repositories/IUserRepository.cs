using Application.Abstractions.Repositories;
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
        Task<PagedList<SearchUserDto>> SearchAsync(string? searchQuery, Guid? currentUserId, int page, int pageSize, CancellationToken cancellationToken = default);
    }
}
