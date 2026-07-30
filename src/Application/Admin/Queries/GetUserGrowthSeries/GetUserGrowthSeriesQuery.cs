using Application.Abstractions.Messaging;
using Application.DTOs.Admin;

namespace Application.Admin.Queries.GetUserGrowthSeries;

/// <summary>
/// New user registrations per day (or per week for the 90-day window).
/// <paramref name="Days"/> is normalized to 7, 30 or 90 by the handler.
/// </summary>
public sealed record GetUserGrowthSeriesQuery(int Days = 7) : IQuery<IReadOnlyList<DailyCountDto>>;