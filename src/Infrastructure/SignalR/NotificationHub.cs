using Application.Abstractions.SignalR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Infrastructure.SignalR;

[Authorize]
public class NotificationHub : Hub
{
    private readonly IPresenceTracker _presenceTracker;

    public NotificationHub(IPresenceTracker presenceTracker)
    {
        _presenceTracker = presenceTracker;
    }

    private Guid GetUserId()
    {
        var userIdStr = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdStr, out var userId)
            ? userId
            : throw new Exception("UserId not found");
    }

    public override async Task OnConnectedAsync()
    {
        var userId = GetUserId();
        var connectionId = Context.ConnectionId;

        _presenceTracker.UserConnected(userId.ToString(), connectionId);

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = GetUserId();
        var connectionId = Context.ConnectionId;

        _presenceTracker.UserDisconnected(userId.ToString(), connectionId);

        await base.OnDisconnectedAsync(exception);
    }
}
