using Application.DTOs.Admin;

namespace Application.Admin;

/// <summary>
/// Shared helpers for the admin dashboard time-series queries. Keeps the
/// window math and gap-fill logic in one place so each handler only has to
/// focus on its own repo call.
/// </summary>
internal static class AdminSeriesHelper
{
    /// <summary>
    /// Validates the requested window and computes the [from, to) UTC range.
    /// 7/30 use daily buckets; 90 collapses into weekly buckets so the chart
    /// stays readable.
    /// </summary>
    public static (DateTime FromUtc, DateTime ToUtc, bool WeeklyBuckets) ResolveWindow(int days)
    {
        // Clamp to the windows the UI exposes. Any other value falls back to 7.
        var normalized = days switch
        {
            7  => 7,
            30 => 30,
            90 => 90,
            _  => 7,
        };

        var toUtc   = DateTime.UtcNow.Date.AddDays(1);            // exclusive upper bound
        var fromUtc = toUtc.AddDays(-normalized);                  // inclusive lower bound

        // 90 days -> weekly so we don't ship 90 thin bars on the chart.
        var weekly = normalized >= 90;

        return (fromUtc, toUtc, weekly);
    }

    /// <summary>
    /// Fills missing days in the requested window with zero counts. The DB
    /// only returns rows for days that had activity, so without this step
    /// the chart would have gaps that look like dropped data.
    /// </summary>
    public static IReadOnlyList<DailyCountDto> FillDailyGaps(
        DateOnly fromInclusive,
        DateOnly toExclusive,
        IEnumerable<DailyCountDto> raw)
    {
        var lookup = raw.ToDictionary(r => r.Day, r => r.Count);
        var result = new List<DailyCountDto>((toExclusive.DayNumber - fromInclusive.DayNumber) + 1);
        for (var d = fromInclusive; d < toExclusive; d = d.AddDays(1))
        {
            result.Add(new DailyCountDto(d, lookup.TryGetValue(d, out var c) ? c : 0));
        }
        return result;
    }

    /// <summary>
    /// Buckets daily rows into ISO weeks (Mon-Sun). The last bucket may be
    /// partial; we include it as-is because the chart can label it by its
    /// starting day and the partiality is implicit.
    /// </summary>
    public static IReadOnlyList<DailyCountDto> AggregateToWeekly(
        IEnumerable<DailyCountDto> daily)
    {
        var weeks = new List<DailyCountDto>();
        var bucketStart = (DateOnly?)null;
        var bucketSum = 0;
        foreach (var row in daily.OrderBy(r => r.Day))
        {
            // Normalize: in .NET, DayOfWeek.Sunday == 0; we want Monday-start weeks.
            // So offset to subtract from the current day: Mon=0, Tue=1, ..., Sun=6.
            var mondayOffset = ((int)row.Day.DayOfWeek + 6) % 7;
            var weekStart    = row.Day.AddDays(-mondayOffset);

            if (bucketStart == null || bucketStart.Value != weekStart)
            {
                if (bucketStart != null)
                {
                    weeks.Add(new DailyCountDto(bucketStart.Value, bucketSum));
                }
                bucketStart = weekStart;
                bucketSum   = row.Count;
            }
            else
            {
                bucketSum += row.Count;
            }
        }
        if (bucketStart != null)
        {
            weeks.Add(new DailyCountDto(bucketStart.Value, bucketSum));
        }
        return weeks;
    }
}