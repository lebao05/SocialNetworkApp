using Application.Abstractions.Repositories;
using Application.Abstractions.SignalR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Infrastructure.SignalR;

[Authorize]
public class CallHub : Hub
{
    private readonly IUserRepository _userRepository;
    private readonly IPresenceTracker _presenceTracker;
    private readonly ICallHubNotifier _callHubNotifier;

    public CallHub(
        IUserRepository userRepository,
        IPresenceTracker presenceTracker,
        ICallHubNotifier callHubNotifier)
    {
        _userRepository = userRepository;
        _presenceTracker = presenceTracker;
        _callHubNotifier = callHubNotifier;
    }
    public override async Task OnConnectedAsync()
    {
        var userId = GetUserId();

        Console.WriteLine(
            $"[CallHub] User connected. UserId={userId}, ConnectionId={Context.ConnectionId}");

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = GetUserId();

        Console.WriteLine(
            $"[CallHub] User disconnected. UserId={userId}, ConnectionId={Context.ConnectionId}");

        if (exception != null)
        {
            Console.WriteLine(
                $"[CallHub] Disconnect reason: {exception.Message}");
        }

        await base.OnDisconnectedAsync(exception);
    }
    private Guid GetUserId()
    {
        var userIdStr = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdStr, out var userId)
            ? userId
            : throw new Exception("UserId not found");
    }

    /// <summary>Initiate a 1:1 audio call. Notifies the callee via SignalR.</summary>
    public async Task StartCall(string targetUserId)
    {
        var callerId = GetUserId();
        var calleeConnections = _presenceTracker.GetConnections(targetUserId);

        if (calleeConnections.Count == 0)
        {
            throw new HubException("User is not online.");
        }

        var caller = await _userRepository.GetByIdAsync(callerId, CancellationToken.None);

        await _callHubNotifier.NotifyIncomingCallAsync(
            callerId,
            $"{caller?.FirstName} {caller?.LastName}",
            caller?.AvatarUrl,
            calleeConnections,
            CancellationToken.None);
    }

    /// <summary>Callee accepts — notifies the caller to send the WebRTC offer.</summary>
    public async Task AcceptCall(string callerUserId)
    {
        var calleeId = GetUserId();
        var callerConnections = _presenceTracker.GetConnections(callerUserId);

        if (callerConnections.Count == 0) return;

        await _callHubNotifier.NotifyCallAcceptedAsync(
            Guid.Parse(callerUserId),
            calleeId,
            callerConnections,
            CancellationToken.None);
    }

    /// <summary>Callee rejects the call.</summary>
    public async Task RejectCall(string callerUserId)
    {
        var calleeId = GetUserId();
        var callerConnections = _presenceTracker.GetConnections(callerUserId);

        if (callerConnections.Count == 0) return;

        await _callHubNotifier.NotifyCallRejectedAsync(
            Guid.Parse(callerUserId),
            calleeId,
            callerConnections,
            CancellationToken.None);
    }

    /// <summary>Relay a WebRTC signaling message (offer/answer/ICE candidate) to a specific user.</summary>
    public async Task SendSignal(string targetUserId, string signalType, string signalData)
    {
        var senderId = GetUserId();
        var targetConnections = _presenceTracker.GetConnections(targetUserId);

        if (targetConnections.Count == 0)
        {
            throw new HubException("Target user is not online.");
        }

        await _callHubNotifier.RelaySignalAsync(
            senderId,
            Guid.Parse(targetUserId),
            signalType,
            signalData,
            targetConnections,
            CancellationToken.None);
    }

    /// <summary>Notify participants that a call has ended.</summary>
    public async Task EndCall(string conversationId)
    {
        await _callHubNotifier.NotifyCallEndedAsync(long.Parse(conversationId), CancellationToken.None);
    }
}
