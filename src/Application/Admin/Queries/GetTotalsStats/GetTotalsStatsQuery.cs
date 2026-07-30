using Application.Abstractions.Messaging;
using Application.DTOs.Admin;

namespace Application.Admin.Queries.GetTotalsStats;

/// <summary>
/// Single-shot request for the four KPI cards on the admin dashboard.
/// All counts run in parallel inside the handler.
/// </summary>
public sealed record GetTotalsStatsQuery : IQuery<DashboardTotalsDto>;