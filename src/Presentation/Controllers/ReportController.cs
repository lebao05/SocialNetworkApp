using Application.DTOs.Admin;
using Application.Report.Commands.CreateReport;
using Application.Report.Commands.ReviewReport;
using Application.Report.Queries.GetReports;
using Domain.Enums;
using Domain.Shared;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;
using System.Security.Claims;

namespace Presentation.Controllers;

[Authorize]
[Route("api/reports")]
public class ReportController : ApiController
{
    public ReportController(ISender sender) : base(sender) { }

    /// <summary>POST /api/reports</summary>
    /// <remarks>Submit a report for any content type (post, reel, user, group).</remarks>
    [HttpPost]
    public async Task<IActionResult> CreateReport(
        [FromBody] CreateReportRequest request,
        CancellationToken cancellationToken)
    {
        var reporterId = GetCurrentUserId();
        if (reporterId == Guid.Empty) return Unauthorized();

        if (!Enum.TryParse<ReportType>(request.ReportType, true, out var reportType))
            return BadRequest(new { error = "Invalid ReportType. Valid values: Post, Reel, User, Group." });

        if (!Enum.TryParse<ReportReason>(request.Reason, true, out var reason))
            return BadRequest(new { error = "Invalid Reason. Valid values: Spam, Harassment, HateSpeech, Violence, Misinformation, NudityOrSexual, IntellectualProperty, SpamOrMisleading, Impersonation, Other." });

        var command = new CreateReportCommand(
            ReporterId: reporterId,
            ReportType: reportType,
            Reason: reason,
            Details: request.Details,
            PostId: request.PostId,
            ReelId: request.ReelId,
            UserId: request.UserId,
            GroupId: request.GroupId);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new { Id = result.Value })
            : HandleFailure(result);
    }

    /// <summary>GET /api/reports?type=&amp;status=&amp;from=&amp;to=&amp;page=&amp;pageSize=</summary>
    /// <remarks>List all reports for admin moderation. Requires ADMIN role.</remarks>
    [HttpGet]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> GetReports(
        [FromQuery] string? type,
        [FromQuery] string? status,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        ReportType? reportType = null;
        ReportStatus? reportStatus = null;

        if (!string.IsNullOrEmpty(type) && Enum.TryParse<ReportType>(type, ignoreCase: true, out var rt))
            reportType = rt;

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<ReportStatus>(status, ignoreCase: true, out var rs))
            reportStatus = rs;

        var result = await _sender.Send(
            new GetReportsQuery(reportType, reportStatus, from, to, page, pageSize), ct);

        if (result.IsFailure)
            return StatusCode(500, new { error = result.Error.Message });

        var payload = result.Value;
        return Ok(new
        {
            items = payload.Items,
            page = payload.Page,
            pageSize = payload.PageSize,
            totalCount = payload.TotalCount,
            totalPages = (int)Math.Ceiling(payload.TotalCount / (double)payload.PageSize),
            hasNext = payload.Page * payload.PageSize < payload.TotalCount,
            hasPrev = payload.Page > 1,
        });
    }

    /// <summary>POST /api/reports/{id}/review</summary>
    /// <remarks>Review (approve/dismiss) a report. Requires ADMIN role.</remarks>
    [HttpPost("{id:long}/review")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> ReviewReport(
        long id,
        [FromBody] ReviewReportRequest body,
        CancellationToken ct = default)
    {
        var reviewerId = User.FindFirst(ClaimTypes.NameIdentifier) is { Value: var uid } && Guid.TryParse(uid, out var rid)
            ? rid
            : Guid.Empty;

        var result = await _sender.Send(new ReviewReportCommand(
            id, reviewerId, body.Action, body.IsDismissed, body.ReviewNote), ct);

        return result.IsSuccess
            ? Ok(result.Value)
            : NotFound(new { error = result.Error.Message });
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim is { Value: var uid } && Guid.TryParse(uid, out var id) ? id : Guid.Empty;
    }
}

/// <summary>Request body for POST /api/reports</summary>
public record CreateReportRequest(
    string ReportType,
    string Reason,
    string? Details = null,
    long? PostId = null,
    long? ReelId = null,
    Guid? UserId = null,
    long? GroupId = null
);

/// <summary>Request body for POST /api/reports/{id}/review</summary>
public record ReviewReportRequest(
    ReportReviewAction Action,
    bool IsDismissed,
    string? ReviewNote = null
);
