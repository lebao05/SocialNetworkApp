using Microsoft.Extensions.Logging;

namespace Infrastructure.SignalR
{
    public class PresenceTracker
    {
        // userId -> connectionIds
        private static readonly Dictionary<string, List<string>> _onlineUsers = new();

        // groupName (conversationId) -> userIds
        private static readonly Dictionary<string, HashSet<string>> _groups = new();

        // userId -> groupNames
        private static readonly Dictionary<string, HashSet<string>> _userGroups = new();

        private static readonly object _lock = new object();
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
                if (_onlineUsers.ContainsKey(userId))
                {
                    _onlineUsers[userId].Add(connectionId);
                    return false; // already online
                }

                _onlineUsers[userId] = new List<string> { connectionId };
                return true; // first connection
            }
        }

        public bool UserDisconnected(string userId, string connectionId)
        {
            lock (_lock)
            {
                if (!_onlineUsers.ContainsKey(userId))
                    return false;

                _onlineUsers[userId].Remove(connectionId);

                if (_onlineUsers[userId].Count == 0)
                {
                    _onlineUsers.Remove(userId);
                    return true; // fully offline
                }

                return false;
            }
        }

        public List<string> GetOnlineUsers()
        {
            lock (_lock)
            {
                return _onlineUsers.Keys.ToList();
            }
        }

        public bool IsOnline(string userId)
        {
            lock (_lock)
            {
                return _onlineUsers.ContainsKey(userId);
            }
        }

        public List<string> GetConnections(string userId)
        {
            lock (_lock)
            {
                return _onlineUsers.TryGetValue(userId, out var connections)
                    ? connections
                    : new List<string>();
            }
        }

        // =============================
        // GROUP MANAGEMENT
        // =============================

        public void AddToGroup(string userId, string groupName)
        {
            lock (_lock)
            {
                if (!_groups.ContainsKey(groupName))
                    _groups[groupName] = new HashSet<string>();

                _groups[groupName].Add(userId);

                if (!_userGroups.ContainsKey(userId))
                    _userGroups[userId] = new HashSet<string>();

                _userGroups[userId].Add(groupName);
            }
        }

        public void RemoveFromGroup(string userId, string groupName)
        {
            lock (_lock)
            {
                if (_groups.ContainsKey(groupName))
                {
                    _groups[groupName].Remove(userId);
                    if (_groups[groupName].Count == 0)
                        _groups.Remove(groupName);
                }

                if (_userGroups.ContainsKey(userId))
                {
                    _userGroups[userId].Remove(groupName);
                    if (_userGroups[userId].Count == 0)
                        _userGroups.Remove(userId);
                }
            }
        }

        public List<string> GetUserGroups(string userId)
        {
            lock (_lock)
            {
                return _userGroups.TryGetValue(userId, out var groups)
                    ? groups.ToList()
                    : new List<string>();
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
    }
}