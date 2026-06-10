using Application.Abstractions.SignalR;
using Microsoft.AspNetCore.SignalR;

namespace Infrastructure.SignalR;

public class ChatHubNotifier : IChatHubNotifier
{
    private readonly IHubContext<ChatHub> _hubContext;

    public ChatHubNotifier(IHubContext<ChatHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task NotifyUserOnlineToConnectionAsync(
        string connectionId,
        string userId,
        CancellationToken cancellationToken = default)
    {
        await _hubContext.Clients.Client(connectionId)
            .SendAsync("UserOnline", userId, cancellationToken);
    }
}
