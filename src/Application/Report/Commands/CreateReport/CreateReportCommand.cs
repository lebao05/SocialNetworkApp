using Application.Abstractions.Messaging;
using Domain.Enums;

namespace Application.Report.Commands.CreateReport;

/// <summary>
/// Creates a new generic report for any content type (post, reel, user, group).
/// </summary>
public sealed record CreateReportCommand(
    Guid ReporterId,
    ReportType ReportType,
    ReportReason Reason,
    string? Details = null,
    long? PostId = null,
    long? ReelId = null,
    Guid? UserId = null,
    long? GroupId = null
) : ICommand<long>;
