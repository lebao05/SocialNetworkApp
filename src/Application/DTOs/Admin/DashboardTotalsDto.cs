namespace Application.DTOs.Admin;

/// <summary>
/// Single-shot payload for the four KPI cards on the admin dashboard.
/// Returned by GET /admin/api/stats/totals — all counts are computed at the
/// database so the server never materializes full tables.
/// </summary>
public sealed record DashboardTotalsDto(
    long TotalUsers,
    long TotalPosts,
    long TotalReels,
    long OnlineNow,
    long TotalActiveGroups);