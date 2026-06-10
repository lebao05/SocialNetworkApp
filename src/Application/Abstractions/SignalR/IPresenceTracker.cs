namespace Application.Abstractions.SignalR;

public interface IPresenceTracker
{
    // ----- Online / Offline -----
    bool UserConnected(string userId, string connectionId);
    bool UserDisconnected(string userId, string connectionId);
    bool IsOnline(string userId);
    List<string> GetOnlineUsers();
    List<string> GetConnections(string userId);

    // ----- Group Management -----
    void AddToGroup(string userId, string groupName);
    void RemoveFromGroup(string userId, string groupName);
    List<string> GetGroupUsers(string groupName);

    Task UserConnectedToGroups(string userId, string connectionId, IReadOnlyList<long> conversationIds);

    /// <summary>
    /// Returns all groups. Used to remove a user from every group on disconnect.
    /// </summary>
    ICollection<HashSet<string>> GetGroups();
}
