using Application.Abstractions.Messaging;
using Application.DTOs.Admin;
using Domain.Shared;

namespace Application.Report.Queries.GetReportById;

/// <summary>
/// Get a single report by its ID for the admin resolve page.
/// </summary>
public sealed record GetReportByIdQuery(long Id) : IQuery<ReportDto>;
