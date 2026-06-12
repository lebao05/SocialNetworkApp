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
        IReadOnlyList<string> calleeConnectionIds,
        CancellationToken cancellationToken = default)
    {
        await _hubContext.Clients
            .Clients(calleeConnectionIds)
            .SendAsync(
                "IncomingCall",
                new
                {
                    callerId = callerId.ToString(),
                    callerName,
                    callerAvatar
                },
                cancellationToken);
    }

    public async Task NotifyCallAcceptedAsync(
        Guid callerId,
        Guid calleeId,
        IReadOnlyList<string> callerConnectionIds,
        CancellationToken cancellationToken = default)
    {
        await _hubContext.Clients
            .Clients(callerConnectionIds)
            .SendAsync(
                "CallAccepted",
                new { calleeId = calleeId.ToString() },
                cancellationToken);
    }

    public async Task NotifyCallRejectedAsync(
        Guid callerId,
        Guid calleeId,
        IReadOnlyList<string> callerConnectionIds,
        CancellationToken cancellationToken = default)
    {
        await _hubContext.Clients
            .Clients(callerConnectionIds)
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
        IReadOnlyList<string> targetConnectionIds,
        CancellationToken cancellationToken = default)
    {
        await _hubContext.Clients
            .Clients(targetConnectionIds)
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
