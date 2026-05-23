using Domain.Entities;

namespace Application.Abstractions.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(Guid id,CancellationToken cancellationToken);
        Task<bool> ExistsAsync(Guid id,CancellationToken cancellationToken);
        Task<List<User>> GetAllAsync(CancellationToken cancellationToken = default);
    }
}
