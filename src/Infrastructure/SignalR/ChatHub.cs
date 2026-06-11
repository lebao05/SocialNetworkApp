using Application.Abstractions.Repositories;
using Application.Abstractions.SignalR;
using Application.Conversations.Queries.GetConversations;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Infrastructure.SignalR;

[Authorize]
public class ChatHub : Hub
{
    private readonly IMediator _mediator;
    private readonly IPresenceTracker _presence;
    private readonly IConversationRepository _conversationRepository;
    private readonly IUserRepository _userRepository;

    public ChatHub(
        IMediator mediator,
        IPresenceTracker presence,
        IConversationRepository conversationRepository,
        IUserRepository userRepository)
    {
        _mediator = mediator;
        _presence = presence;
        _conversationRepository = conversationRepository;
        _userRepository = userRepository;
    }

    private Guid GetUserId()
    {
        var userIdStr = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdStr, out var userId)
            ? userId
            : throw new Exception("UserId not found");
    }

    public override async Task OnConnectedAsync()
    {
        var userId = GetUserId();
        var connectionId = Context.ConnectionId;

        bool isOnline = _presence.UserConnected(userId.ToString(), connectionId);

        var conversationIds = await _conversationRepository.GetAllConversationIdsAsync(userId, CancellationToken.None);

        await _presence.UserConnectedToGroups(userId.ToString(), connectionId, conversationIds);

        foreach (var conversationId in conversationIds)
        {
            await Groups.AddToGroupAsync(connectionId, conversationId.ToString());
            if (isOnline)
                await Clients.Group(conversationId.ToString())
                    .SendAsync("UserOnline", userId.ToString());
        }

        await base.OnConnectedAsync();
    }

    public async Task Typing(string conversationId)
    {
        var userId = GetUserId();
        await Clients.Group(conversationId)
            .SendAsync("UserTyping", new { userId = userId.ToString(), conversationId });
    }

    public async Task Untyping(string conversationId)
    {
        var userId = GetUserId();
        await Clients.Group(conversationId)
            .SendAsync("UserUntyping", new { userId = userId.ToString(), conversationId });
    }

    // ── Audio Call ────────────────────────────────────────────────────────────

    /// <summary>Initiate a 1:1 audio call. Notifies the callee via SignalR.</summary>
    public async Task StartCall(string targetUserId)
    {
        var callerId = GetUserId();
        var callerConnections = _presence.GetConnections(targetUserId);

        if (callerConnections.Count == 0)
        {
            throw new HubException("User is not online.");
        }

        var caller = await _userRepository.GetByIdAsync(callerId, CancellationToken.None);

        await Clients.Clients(callerConnections)
            .SendAsync("IncomingCall", new
            {
                callerId = callerId.ToString(),
                callerName = caller?.DisplayName ?? Context.User?.Identity?.Name ?? "Someone",
                callerAvatar = caller?.AvatarUrl ?? (string?)null
            });
    }

    /// <summary>Callee accepts — notifies the caller to send the WebRTC offer.</summary>
    public async Task AcceptCall(string callerUserId)
    {
        var calleeId = GetUserId();
        var callerConnections = _presence.GetConnections(callerUserId);

        if (callerConnections.Count == 0) return;

        await Clients.Clients(callerConnections)
            .SendAsync("CallAccepted", new { calleeId = calleeId.ToString() });
    }

    /// <summary>Callee rejects the call.</summary>
    public async Task RejectCall(string callerUserId)
    {
        var calleeId = GetUserId();
        var callerConnections = _presence.GetConnections(callerUserId);

        if (callerConnections.Count == 0) return;

        await Clients.Clients(callerConnections)
            .SendAsync("CallRejected", new { calleeId = calleeId.ToString() });
    }

    /// <summary>Relay a WebRTC signaling message (offer/answer/ICE candidate) to a specific user.</summary>
    public async Task SendSignal(string targetUserId, string signalType, string signalData)
    {
        var senderId = GetUserId();
        var targetConnections = _presence.GetConnections(targetUserId);

        if (targetConnections.Count == 0)
        {
            throw new HubException("Target user is not online.");
        }

        await Clients.Clients(targetConnections)
            .SendAsync("ReceiveSignal", new
            {
                senderId = senderId.ToString(),
                signalType,
                signalData
            });
    }

    /// <summary>Notify participants that a call has ended.</summary>
    public async Task EndCall(string conversationId)
    {
        await Clients.Group(conversationId)
            .SendAsync("CallEnded", new { conversationId });
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = GetUserId();
        var connectionId = Context.ConnectionId;

        var isOffline = _presence.UserDisconnected(userId.ToString(), connectionId);

        if (isOffline)
        {
            var conversationIds = await _conversationRepository.GetAllConversationIdsAsync(userId, CancellationToken.None);

            foreach (var group in _presence.GetGroups())
                group.Remove(userId.ToString());
            foreach (var conversationId in conversationIds)
            {
                await Clients.Group(conversationId.ToString())
                    .SendAsync("UserOffline", userId.ToString());
            }
        }

        await base.OnDisconnectedAsync(exception);
    }
}
