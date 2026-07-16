namespace Application.Abstractions.SignalR;

/// <summary>
/// Connection tracking dedicated to the notification hub. Kept separate from the
/// general-purpose <see cref="IPresenceTracker"/> used by ChatHub so that the two
/// hubs do not share presence state.
/// </summary>
public interface INotificationPresenceTracker
{
    /// <summary>
    /// Registers a new SignalR connection for a user. Returns <c>true</c> when
    /// this is the user's first active connection (transitioned from offline to
    /// online), <c>false</c> when the user already had at least one connection.
    /// </summary>
    bool UserConnected(string userId, string connectionId);

    /// <summary>
    /// Removes a SignalR connection for a user. Returns <c>true</c> when the user
    /// has no more active connections (transitioned from online to offline),
    /// <c>false</c> otherwise.
    /// </summary>
    bool UserDisconnected(string userId, string connectionId);

    /// <summary>Returns the active connection IDs for the given user.</summary>
    IReadOnlyList<string> GetConnections(string userId);

    /// <summary>Returns whether the user has at least one active connection.</summary>
    bool IsOnline(string userId);
}
