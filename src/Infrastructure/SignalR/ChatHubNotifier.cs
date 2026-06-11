using Application.Abstractions.SignalR;
using Microsoft.AspNetCore.SignalR;

namespace Infrastructure.SignalR;

public class ChatHubNotifier : IChatHubNotifier
{
    private readonly IHubContext<ChatHub> _hubContext;
    private readonly IPresenceTracker _presenceTracker;

    public ChatHubNotifier(IHubContext<ChatHub> hubContext, IPresenceTracker presenceTracker)
    {
        _hubContext = hubContext;
        _presenceTracker = presenceTracker;
    }

    public async Task AddConnectionsToGroupAsync(
        long conversationId,
        IReadOnlyList<Guid> userIds,
        CancellationToken cancellationToken = default)
    {
        var groupName = conversationId.ToString();

        foreach (var userId in userIds)
        {
            var connectionIds = _presenceTracker.GetConnections(userId.ToString());

            foreach (var connectionId in connectionIds)
            {
                await _hubContext.Groups.AddToGroupAsync(connectionId, groupName, cancellationToken);
            }
        }
    }
}
