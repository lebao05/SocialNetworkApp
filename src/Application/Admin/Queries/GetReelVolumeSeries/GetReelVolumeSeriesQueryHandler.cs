using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Admin;
using Domain.Shared;

namespace Application.Admin.Queries.GetReelVolumeSeries;

internal sealed class GetReelVolumeSeriesQueryHandler
    : IQueryHandler<GetReelVolumeSeriesQuery, IReadOnlyList<DailyCountDto>>
{
    private readonly IReelRepository _reels;

    public GetReelVolumeSeriesQueryHandler(IReelRepository reels) => _reels = reels;

    public async Task<Result<IReadOnlyList<DailyCountDto>>> Handle(
        GetReelVolumeSeriesQuery request,
        CancellationToken cancellationToken)
    {
        var (fromUtc, toUtc, weekly) = AdminSeriesHelper.ResolveWindow(request.Days);
        var raw = await _reels.GetReelSeriesAsync(fromUtc, toUtc, cancellationToken);

        var fromDo = DateOnly.FromDateTime(fromUtc);
        var toDo   = DateOnly.FromDateTime(toUtc);
        var daily  = AdminSeriesHelper.FillDailyGaps(fromDo, toDo, raw);
        var series = weekly ? AdminSeriesHelper.AggregateToWeekly(daily) : daily;

        return Result.Success(series);
    }
}