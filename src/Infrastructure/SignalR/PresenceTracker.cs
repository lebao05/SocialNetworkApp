using Application.Abstractions.SignalR;
using Microsoft.Extensions.Logging;

namespace Infrastructure.SignalR;

public class PresenceTracker : IPresenceTracker
{
    private static readonly Dictionary<string, HashSet<string>> _onlineUsers = new();
    private static readonly Dictionary<string, HashSet<string>> _groups = new();
    private static readonly object _lock = new();
    private readonly ILogger<PresenceTracker> _logger;

    public PresenceTracker(ILogger<PresenceTracker> logger)
    {
        _logger = logger;
    }

    public bool UserConnected(string userId, string connectionId)
    {
        lock (_lock)
        {
            if (_onlineUsers.TryGetValue(userId, out var connections))
            {
                connections.Add(connectionId);
                return false;
            }

            _onlineUsers[userId] = new HashSet<string> { connectionId };
            return true;
        }
    }

    public bool UserDisconnected(string userId, string connectionId)
    {
        lock (_lock)
        {
            if (!_onlineUsers.TryGetValue(userId, out var connections))
                return false;

            connections.Remove(connectionId);

            if (connections.Count == 0)
            {
                _onlineUsers.Remove(userId);
                return true;
            }

            return false;
        }
    }

    public bool IsOnline(string userId)
    {
        lock (_lock)
        {
            return _onlineUsers.ContainsKey(userId);
        }
    }

    public List<string> GetOnlineUsers()
    {
        lock (_lock)
        {
            return _onlineUsers.Keys.ToList();
        }
    }

    public List<string> GetConnections(string userId)
    {
        lock (_lock)
        {
            return _onlineUsers.TryGetValue(userId, out var connections)
                ? connections.ToList()
                : new List<string>();
        }
    }

    public void AddToGroup(string userId, string groupName)
    {
        lock (_lock)
        {
            if (!_groups.ContainsKey(groupName))
                _groups[groupName] = new HashSet<string>();

            _groups[groupName].Add(userId);
        }
    }

    public void RemoveFromGroup(string userId, string groupName)
    {
        lock (_lock)
        {
            if (_groups.TryGetValue(groupName, out var groupUsers))
            {
                groupUsers.Remove(userId);
                if (groupUsers.Count == 0)
                    _groups.Remove(groupName);
            }
        }
    }

    public List<string> GetGroupUsers(string groupName)
    {
        lock (_lock)
        {
            return _groups.TryGetValue(groupName, out var users)
                ? users.ToList()
                : new List<string>();
        }
    }

    public Task UserConnectedToGroups(string userId, string connectionId, IReadOnlyList<long> conversationIds)
    {
        lock (_lock)
        {
            foreach (var conversationId in conversationIds)
            {
                var groupName = conversationId.ToString();

                if (!_groups.ContainsKey(groupName))
                    _groups[groupName] = new HashSet<string>();

                _groups[groupName].Add(userId);
            }
        }

        _logger.LogInformation("User {UserId} connected, registered {Count} groups", userId, conversationIds.Count);
        return Task.CompletedTask;
    }

    public ICollection<HashSet<string>> GetGroups()
    {
        lock (_lock)
        {
            return _groups.Values.ToList();
        }
    }
}
