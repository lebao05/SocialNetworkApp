using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Admin;
using Domain.Shared;

namespace Application.Admin.Queries.GetCommentVolumeSeries;

internal sealed class GetCommentVolumeSeriesQueryHandler
    : IQueryHandler<GetCommentVolumeSeriesQuery, IReadOnlyList<DailyCountDto>>
{
    private readonly IPostRepository _posts;

    public GetCommentVolumeSeriesQueryHandler(IPostRepository posts) => _posts = posts;

    public async Task<Result<IReadOnlyList<DailyCountDto>>> Handle(
        GetCommentVolumeSeriesQuery request,
        CancellationToken cancellationToken)
    {
        var (fromUtc, toUtc, weekly) = AdminSeriesHelper.ResolveWindow(request.Days);
        var raw = await _posts.GetCommentSeriesAsync(fromUtc, toUtc, cancellationToken);

        var fromDo = DateOnly.FromDateTime(fromUtc);
        var toDo   = DateOnly.FromDateTime(toUtc);
        var daily  = AdminSeriesHelper.FillDailyGaps(fromDo, toDo, raw);
        var series = weekly ? AdminSeriesHelper.AggregateToWeekly(daily) : daily;

        return Result.Success(series);
    }
}