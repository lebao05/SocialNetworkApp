using Application.Abstractions.SignalR;
using Microsoft.AspNetCore.SignalR;

namespace Infrastructure.SignalR;

public class CallHubNotifier : ICallHubNotifier
{
    private readonly IHubContext<CallHub> _hubContext;

    public CallHubNotifier(IHubContext<CallHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task NotifyIncomingCallAsync(
        Guid callerId,
        string callerName,
        string? callerAvatar,
        bool isVideo,
        Guid otherId,
        CancellationToken cancellationToken = default)
    {
        await _hubContext.Clients
            .User(otherId.ToString())
            .SendAsync(
                "IncomingCall",
                new
                {
                    callerId = callerId.ToString(),
                    callerName,
                    callerAvatar,
                    isVideo
                },
                cancellationToken);
    }

    public async Task NotifyCallAcceptedAsync(
        Guid callerId,
        Guid calleeId,
        CancellationToken cancellationToken = default)
    {
        await _hubContext.Clients
            .User(callerId.ToString())
            .SendAsync(
                "CallAccepted",
                new { calleeId = calleeId.ToString() },
                cancellationToken);
    }

    public async Task NotifyCallRejectedAsync(
        Guid callerId,
        Guid calleeId,
        CancellationToken cancellationToken = default)
    {
        await _hubContext.Clients
            .User(callerId.ToString())
            .SendAsync(
                "CallRejected",
                new { calleeId = calleeId.ToString() },
                cancellationToken);
    }

    public async Task RelaySignalAsync(
        Guid senderId,
        Guid targetId,
        string signalType,
        string signalData,
        CancellationToken cancellationToken = default)
    {
        await _hubContext.Clients
            .User(targetId.ToString())
            .SendAsync(
                "ReceiveSignal",
                new
                {
                    senderId = senderId.ToString(),
                    signalType,
                    signalData
                },
                cancellationToken);
    }

    public async Task NotifyCallEndedAsync(
        long conversationId,
        CancellationToken cancellationToken = default)
    {
        await _hubContext.Clients
            .Group(conversationId.ToString())
            .SendAsync("CallEnded", new { conversationId }, cancellationToken);
    }
}
