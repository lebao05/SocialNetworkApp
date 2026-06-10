using Application.Abstractions.SignalR;
using Microsoft.Extensions.Logging;

namespace Infrastructure.SignalR;

public class PresenceTracker : IPresenceTracker
{
    // userId → [connectionIds]  — tracks online status (multi-device support)
    private static readonly Dictionary<string, HashSet<string>> _onlineUsers = new();

    // groupName → [userIds]  — "who is in this group"
    private static readonly Dictionary<string, HashSet<string>> _groups = new();

    private static readonly object _lock = new();
    private readonly ILogger<PresenceTracker> _logger;

    public PresenceTracker(ILogger<PresenceTracker> logger)
    {
        _logger = logger;
    }

    // =============================
    // USER ONLINE / OFFLINE
    // =============================

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

    /// <summary>
    /// Removes a connection. Returns true only when the user has no remaining connections (fully offline).
    /// </summary>
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


    /// <summary>
    /// Adds a user to a group. Used by JoinConversation hub method.
    /// </summary>
    public void AddToGroup(string userId, string groupName)
    {
        lock (_lock)
        {
            if (!_groups.ContainsKey(groupName))
                _groups[groupName] = new HashSet<string>();

            _groups[groupName].Add(userId);
        }
    }

    /// <summary>
    /// Removes a user from a group. Used by LeaveConversation hub method.
    /// </summary>
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


    // =============================
    // AUTO-JOIN ON CONNECT
    // =============================

    /// <summary>
    /// Adds a user to all conversation groups on connect.
    /// </summary>
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

    // =============================
    // CLEANUP ON DISCONNECT
    // =============================

    /// <summary>
    /// Returns all groups. Used to remove a user from every group on disconnect.
    /// </summary>
    public ICollection<HashSet<string>> GetGroups()
    {
        lock (_lock)
        {
            return _groups.Values.ToList();
        }
    }
}
