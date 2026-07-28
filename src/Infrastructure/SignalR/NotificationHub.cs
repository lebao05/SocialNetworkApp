using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Infrastructure.SignalR;

[Authorize]
public class NotificationHub : Hub
{
    private Guid GetUserId()
    {
        var userIdStr = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdStr, out var userId)
            ? userId
            : throw new Exception("UserId not found");
    }

    public override Task OnConnectedAsync()
    {
        // Connection → user mapping is managed automatically by SignalR via the
        // authenticated NameIdentifier claim, so Clients.User(...) in the
        // notifier can reach every active connection for that user.
        _ = GetUserId();
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        // No explicit cleanup needed — SignalR clears the mapping when the
        // connection drops.
        return base.OnDisconnectedAsync(exception);
    }
}