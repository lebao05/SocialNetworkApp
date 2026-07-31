using Application.Abstractions.Messaging;
using Application.Admin.Queries.GetCommentVolumeSeries;
using Application.Admin.Queries.GetPostVolumeSeries;
using Application.Admin.Queries.GetReelVolumeSeries;
using Application.Admin.Queries.GetTotalsStats;
using Application.Admin.Queries.GetUserGrowthSeries;
using Application.DTOs.Admin;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers;

/// <summary>
/// Read-only AJAX endpoints that power the admin dashboard charts.
/// Lives in its own controller (not AdminController) so the cookie-based
/// session check on the MVC view actions stays out of the JSON pipeline,
/// and so this file can grow without bloating the views controller.
/// </summary>
[ApiController]
[Route("admin/api/stats")]
[Authorize(AuthenticationSchemes = "AdminCookie", Roles = "ADMIN")]
public class AdminStatsController : ControllerBase
{
    private readonly ISender _sender;

    public AdminStatsController(ISender sender) => _sender = sender;

    /// <summary>GET /admin/api/stats/totals</summary>
    [HttpGet("totals")]
    public async Task<IActionResult> Totals(CancellationToken ct)
    {
        var result = await _sender.Send(new GetTotalsStatsQuery(), ct);
        return result.IsSuccess
            ? Ok(result.Value)
            : StatusCode(500, new { error = result.Error.Message });
    }

    /// <summary>GET /admin/api/stats/user-growth?days=7|30|90</summary>
    [HttpGet("user-growth")]
    public Task<IActionResult> UserGrowth([FromQuery] int days = 7, CancellationToken ct = default)
        => RunAsync(new GetUserGrowthSeriesQuery(days), ct);

    /// <summary>GET /admin/api/stats/post-volume?days=7|30|90</summary>
    [HttpGet("post-volume")]
    public Task<IActionResult> PostVolume([FromQuery] int days = 7, CancellationToken ct = default)
        => RunAsync(new GetPostVolumeSeriesQuery(days), ct);

    /// <summary>GET /admin/api/stats/comment-volume?days=7|30|90</summary>
    [HttpGet("comment-volume")]
    public Task<IActionResult> CommentVolume([FromQuery] int days = 7, CancellationToken ct = default)
        => RunAsync(new GetCommentVolumeSeriesQuery(days), ct);

    /// <summary>GET /admin/api/stats/reel-volume?days=7|30|90</summary>
    [HttpGet("reel-volume")]
    public Task<IActionResult> ReelVolume([FromQuery] int days = 7, CancellationToken ct = default)
        => RunAsync(new GetReelVolumeSeriesQuery(days), ct);

    // ---- Private helper ----

    private async Task<IActionResult> RunAsync(IQuery<IReadOnlyList<DailyCountDto>> query, CancellationToken ct)
    {
        var result = await _sender.Send(query, ct);
        return result.IsSuccess
            ? Ok(result.Value)
            : StatusCode(500, new { error = result.Error.Message });
    }
}