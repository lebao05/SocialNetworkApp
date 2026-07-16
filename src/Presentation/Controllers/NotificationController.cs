using Application.Notifications.Commands.MarkNotificationAsSeen;
using Application.Notifications.Queries.GetPagedNotifications;
using Infrastructure.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;

namespace Presentation.Controllers;

[Route("api/notifications")]
[Authorize]
public class NotificationController : ApiController
{
    public NotificationController(ISender sender) : base(sender) { }

    [HttpGet]
    public async Task<IActionResult> GetPaged(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] bool? isSeen = null,
        CancellationToken ct = default)
    {
        var userId = ClaimsPrincipalExtensions.GetUserId(User);
        var query = new GetPagedNotificationsQuery(userId, page, pageSize, isSeen);
        var result = await _sender.Send(query, ct);
        return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
    }

    [HttpPatch("{notificationId:long}/seen")]
    public async Task<IActionResult> MarkAsSeen(
        long notificationId,
        CancellationToken ct)
    {
        var userId = ClaimsPrincipalExtensions.GetUserId(User);
        var command = new MarkNotificationAsSeenCommand(userId, notificationId);
        var result = await _sender.Send(command, ct);
        return result.IsSuccess ? Ok() : HandleFailure(result);
    }
}
