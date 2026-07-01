using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Users;
using Domain.Shared;

namespace Application.Users.Queries.GetUpcomingBirthdays;

public sealed class GetUpcomingBirthdaysQueryHandler : IQueryHandler<GetUpcomingBirthdaysQuery, List<BirthdayDto>>
{
    private readonly IBirthdayRepository _birthdayRepository;

    public GetUpcomingBirthdaysQueryHandler(IBirthdayRepository birthdayRepository)
    {
        _birthdayRepository = birthdayRepository;
    }

    public async Task<Result<List<BirthdayDto>>> Handle(
        GetUpcomingBirthdaysQuery request,
        CancellationToken cancellationToken)
    {
        var birthdays = await _birthdayRepository.GetUpcomingBirthdaysAsync(request.UserId, cancellationToken);
        return Result.Success(birthdays);
    }
}
