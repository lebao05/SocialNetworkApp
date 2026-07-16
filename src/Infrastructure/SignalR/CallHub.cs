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
    private readonly ICallHubNotifier _callHubNotifier;
    public CallHub(
        IUserRepository userRepository,
        ICallHubNotifier callHubNotifier)
    {
        _userRepository = userRepository;
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

    /// <summary>Initiate a 1:1 audio/video call. Notifies the callee via SignalR.</summary>
    public async Task StartCall(string targetUserId, bool isVideo = false)
    {
        var callerId = GetUserId();
        var targetId = Guid.Parse(targetUserId);

        var caller = await _userRepository.GetByIdAsync(callerId, CancellationToken.None);
        await _callHubNotifier.NotifyIncomingCallAsync(
            callerId,
            $"{caller?.FirstName} {caller?.LastName}",
            caller?.AvatarUrl,
            isVideo,
            targetId,
            CancellationToken.None);
    }

    /// <summary>Callee accepts — notifies the caller to send the WebRTC offer.</summary>
    public async Task AcceptCall(string callerUserId)
    {
        var calleeId = GetUserId();
        await _callHubNotifier.NotifyCallAcceptedAsync(
            Guid.Parse(callerUserId),
            calleeId,
            CancellationToken.None);
    }

    /// <summary>Callee rejects the call.</summary>
    public async Task RejectCall(string callerUserId)
    {
        var calleeId = GetUserId();
        await _callHubNotifier.NotifyCallRejectedAsync(
            Guid.Parse(callerUserId),
            calleeId,
            CancellationToken.None);
    }

    /// <summary>Relay a WebRTC signaling message (offer/answer/ICE candidate) to a specific user.</summary>
    public async Task SendSignal(string targetUserId, string signalType, string signalData)
    {
        var senderId = GetUserId();
        await _callHubNotifier.RelaySignalAsync(
            senderId,
            Guid.Parse(targetUserId),
            signalType,
            signalData,
            CancellationToken.None);
    }

    /// <summary>Notify participants that a call has ended.</summary>
    public async Task EndCall(string conversationId)
    {
        await _callHubNotifier.NotifyCallEndedAsync(long.Parse(conversationId), CancellationToken.None);
    }
}
