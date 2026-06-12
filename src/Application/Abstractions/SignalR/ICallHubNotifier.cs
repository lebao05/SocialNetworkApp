namespace Application.Abstractions.SignalR;

public interface ICallHubNotifier
{
    Task NotifyIncomingCallAsync(Guid callerId, string callerName, string? callerAvatar, IReadOnlyList<string> calleeConnectionIds, CancellationToken cancellationToken = default);
    Task NotifyCallAcceptedAsync(Guid callerId, Guid calleeId, IReadOnlyList<string> callerConnectionIds, CancellationToken cancellationToken = default);
    Task NotifyCallRejectedAsync(Guid callerId, Guid calleeId, IReadOnlyList<string> callerConnectionIds, CancellationToken cancellationToken = default);
    Task RelaySignalAsync(Guid senderId, Guid targetId, string signalType, string signalData, IReadOnlyList<string> targetConnectionIds, CancellationToken cancellationToken = default);
    Task NotifyCallEndedAsync(long conversationId, CancellationToken cancellationToken = default);
}
