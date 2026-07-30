using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Admin;
using Domain.Shared;

namespace Application.Admin.Queries.GetPostVolumeSeries;

internal sealed class GetPostVolumeSeriesQueryHandler
    : IQueryHandler<GetPostVolumeSeriesQuery, IReadOnlyList<DailyCountDto>>
{
    private readonly IPostRepository _posts;

    public GetPostVolumeSeriesQueryHandler(IPostRepository posts) => _posts = posts;

    public async Task<Result<IReadOnlyList<DailyCountDto>>> Handle(
        GetPostVolumeSeriesQuery request,
        CancellationToken cancellationToken)
    {
        var (fromUtc, toUtc, weekly) = AdminSeriesHelper.ResolveWindow(request.Days);
        var raw = await _posts.GetPostSeriesAsync(fromUtc, toUtc, cancellationToken);

        var fromDo = DateOnly.FromDateTime(fromUtc);
        var toDo   = DateOnly.FromDateTime(toUtc);
        var daily  = AdminSeriesHelper.FillDailyGaps(fromDo, toDo, raw);
        var series = weekly ? AdminSeriesHelper.AggregateToWeekly(daily) : daily;

        return Result.Success(series);
    }
}