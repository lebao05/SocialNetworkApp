using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Admin;
using Domain.Shared;

namespace Application.Admin.Queries.GetUserGrowthSeries;

internal sealed class GetUserGrowthSeriesQueryHandler
    : IQueryHandler<GetUserGrowthSeriesQuery, IReadOnlyList<DailyCountDto>>
{
    private readonly IUserRepository _users;

    public GetUserGrowthSeriesQueryHandler(IUserRepository users) => _users = users;

    public async Task<Result<IReadOnlyList<DailyCountDto>>> Handle(
        GetUserGrowthSeriesQuery request,
        CancellationToken cancellationToken)
    {
        var (fromUtc, toUtc, weekly) = AdminSeriesHelper.ResolveWindow(request.Days);

        var raw = await _users.GetRegistrationSeriesAsync(fromUtc, toUtc, cancellationToken);

        var fromDo = DateOnly.FromDateTime(fromUtc);
        var toDo   = DateOnly.FromDateTime(toUtc);

        var daily = AdminSeriesHelper.FillDailyGaps(fromDo, toDo, raw);
        var series = weekly ? AdminSeriesHelper.AggregateToWeekly(daily) : daily;

        return Result.Success(series);
    }
}