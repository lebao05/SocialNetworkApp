using Application.Abstractions.Repositories;
using Application.Abstractions.SignalR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Infrastructure.SignalR;

[Authorize]
public class ChatHub : Hub
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IPresenceTracker _presenceTracker;

    public ChatHub(
        IConversationRepository conversationRepository,
        IPresenceTracker presenceTracker)
    {
        _conversationRepository = conversationRepository;
        _presenceTracker = presenceTracker;
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

        bool isOnline = _presenceTracker.UserConnected(userId.ToString(), connectionId);

        var conversationIds = await _conversationRepository.GetAllConversationIdsAsync(userId, CancellationToken.None);

        await _presenceTracker.UserConnectedToGroups(userId.ToString(), connectionId, conversationIds);

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

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = GetUserId();
        var connectionId = Context.ConnectionId;

        var isOffline = _presenceTracker.UserDisconnected(userId.ToString(), connectionId);

        if (isOffline)
        {
            var conversationIds = await _conversationRepository.GetAllConversationIdsAsync(userId, CancellationToken.None);

            foreach (var group in _presenceTracker.GetGroups())
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
