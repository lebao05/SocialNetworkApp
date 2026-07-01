using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Users;
using Application.Users.Queries.GetTodayBirthdays;
using Domain.Shared;

namespace Application.Users.Queries.GetTodayBirthdays;

public sealed class GetTodayBirthdaysQueryHandler : IQueryHandler<GetTodayBirthdaysQuery, List<BirthdayDto>>
{
    private readonly IBirthdayRepository _birthdayRepository;

    public GetTodayBirthdaysQueryHandler(IBirthdayRepository birthdayRepository)
    {
        _birthdayRepository = birthdayRepository;
    }

    public async Task<Result<List<BirthdayDto>>> Handle(
        GetTodayBirthdaysQuery request,
        CancellationToken cancellationToken)
    {
        var birthdays = await _birthdayRepository.GetTodayBirthdaysAsync(request.UserId, cancellationToken);
        return Result.Success(birthdays);
    }
}
