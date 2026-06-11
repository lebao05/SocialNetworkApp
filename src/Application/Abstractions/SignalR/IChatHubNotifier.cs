namespace Application.Abstractions.SignalR;

public interface IChatHubNotifier
{
    Task AddConnectionsToGroupAsync(long conversationId, IReadOnlyList<Guid> userIds, CancellationToken cancellationToken = default);
}
