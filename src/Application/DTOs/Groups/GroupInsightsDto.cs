namespace Application.DTOs.Groups
{
    public sealed record GroupInsightsDto(
        int TotalMembers,
        int Requests,
        int Reviewed,
        int Approved,
        int Declined,
        int Posts,
        int Comments,
        int Reactions,
        int ActiveMembers,
        List<ChartDataPoint> TopDays,
        List<ChartDataPoint> PeakHours,
        List<ChartDataPoint> GrowthChart,
        List<ChartDataPoint> EngagementChart);

    public sealed record ChartDataPoint(string Label, int Count);
}
