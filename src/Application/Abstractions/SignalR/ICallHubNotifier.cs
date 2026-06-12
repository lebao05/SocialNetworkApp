namespace Application.Abstractions.SignalR;

public interface ICallHubNotifier
{
    Task NotifyIncomingCallAsync(Guid callerId, string callerName, string? callerAvatar, bool isVideo, Guid otherId, CancellationToken cancellationToken = default);
    Task NotifyCallAcceptedAsync(Guid callerId, Guid calleeId, CancellationToken cancellationToken = default);
    Task NotifyCallRejectedAsync(Guid callerId, Guid calleeId, CancellationToken cancellationToken = default);
    Task RelaySignalAsync(Guid senderId, Guid targetId, string signalType, string signalData, CancellationToken cancellationToken = default);
    Task NotifyCallEndedAsync(long conversationId, CancellationToken cancellationToken = default);
}
