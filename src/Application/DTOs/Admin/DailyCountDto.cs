namespace Application.DTOs.Admin;

/// <summary>
/// One bucket in a time-series chart (e.g. registrations per day).
/// Day is the start-of-day in UTC. Count is the aggregated value.
/// Series returned by the dashboard endpoints are pre-gap-filled by the
/// application layer so each day in the requested window is represented,
/// even when the count is zero.
/// </summary>
public sealed record DailyCountDto(DateOnly Day, int Count);