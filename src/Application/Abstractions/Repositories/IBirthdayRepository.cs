using Application.DTOs.Users;

namespace Application.Abstractions.Repositories;

public interface IBirthdayRepository
{
    Task<List<BirthdayDto>> GetTodayBirthdaysAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<List<BirthdayDto>> GetUpcomingBirthdaysAsync(Guid userId, CancellationToken cancellationToken = default);
}
