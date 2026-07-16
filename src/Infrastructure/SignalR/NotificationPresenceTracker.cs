using Application.Abstractions.SignalR;
using Microsoft.Extensions.Logging;

namespace Infrastructure.SignalR;

/// <summary>
/// In-memory connection tracker dedicated to the notification hub.
/// Uses its own static dictionary, separate from the shared
/// <see cref="PresenceTracker"/>, so notification presence never collides with
/// chat presence.
/// </summary>
public class NotificationPresenceTracker : INotificationPresenceTracker
{
    private static readonly Dictionary<string, HashSet<string>> OnlineUsers = new();
    private static readonly object SyncRoot = new();
    private readonly ILogger<NotificationPresenceTracker> _logger;

    public NotificationPresenceTracker(ILogger<NotificationPresenceTracker> logger)
    {
        _logger = logger;
    }

    public bool UserConnected(string userId, string connectionId)
    {
        lock (SyncRoot)
        {
            if (OnlineUsers.TryGetValue(userId, out var connections))
            {
                connections.Add(connectionId);
                _logger.LogDebug(
                    "Notification hub: user {UserId} has {Count} active connection(s)",
                    userId, connections.Count);
                return false;
            }

            OnlineUsers[userId] = new HashSet<string> { connectionId };
            _logger.LogInformation("Notification hub: user {UserId} came online", userId);
            return true;
        }
    }

    public bool UserDisconnected(string userId, string connectionId)
    {
        lock (SyncRoot)
        {
            if (!OnlineUsers.TryGetValue(userId, out var connections))
            {
                return false;
            }

            connections.Remove(connectionId);

            if (connections.Count == 0)
            {
                OnlineUsers.Remove(userId);
                _logger.LogInformation("Notification hub: user {UserId} went offline", userId);
                return true;
            }

            _logger.LogDebug(
                "Notification hub: user {UserId} still has {Count} active connection(s)",
                userId, connections.Count);
            return false;
        }
    }

    public IReadOnlyList<string> GetConnections(string userId)
    {
        lock (SyncRoot)
        {
            return OnlineUsers.TryGetValue(userId, out var connections)
                ? connections.ToList()
                : new List<string>();
        }
    }

    public bool IsOnline(string userId)
    {
        lock (SyncRoot)
        {
            return OnlineUsers.ContainsKey(userId);
        }
    }
}
