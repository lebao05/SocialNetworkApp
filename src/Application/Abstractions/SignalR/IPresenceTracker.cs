namespace Application.Abstractions.SignalR;

public interface IPresenceTracker
{
    bool UserConnected(string userId, string connectionId);
    bool UserDisconnected(string userId, string connectionId);
    bool IsOnline(string userId);
    List<string> GetOnlineUsers();
    List<string> GetConnections(string userId);
    void AddToGroup(string userId, string groupName);
    void RemoveFromGroup(string userId, string groupName);
    List<string> GetGroupUsers(string groupName);
    Task UserConnectedToGroups(string userId, string connectionId, IReadOnlyList<long> conversationIds);
    ICollection<HashSet<string>> GetGroups();
}
