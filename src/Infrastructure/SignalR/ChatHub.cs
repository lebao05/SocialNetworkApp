using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Infrastructure.SignalR
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        private readonly PresenceTracker _presence;

        public ChatHub(IMediator mediator, PresenceTracker presence)
        {
            _mediator = mediator;
            _presence = presence;
        }

        private string GetUserId()
        {
            return Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                   ?? throw new Exception("UserId not found");
        }

        // =============================
        // CONNECTION
        // =============================

        public override async Task OnConnectedAsync()
        {
            var userId = GetUserId();

            var isOnline = _presence.UserConnected(userId, Context.ConnectionId);

            if (isOnline)
            {
                await Clients.All.SendAsync("UserOnline", userId);
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = GetUserId();

            var isOffline = _presence.UserDisconnected(userId, Context.ConnectionId);

            if (isOffline)
            {
                await Clients.All.SendAsync("UserOffline", userId);
            }

            await base.OnDisconnectedAsync(exception);
        }

        // =============================
        // GROUP (CONVERSATION)
        // =============================

        public async Task JoinConversation(string conversationId)
        {
            var userId = GetUserId();

            await Groups.AddToGroupAsync(Context.ConnectionId, conversationId);

            _presence.AddToGroup(userId, conversationId);
        }

        public async Task LeaveConversation(string conversationId)
        {
            var userId = GetUserId();

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, conversationId);

            _presence.RemoveFromGroup(userId, conversationId);
        }

        // =============================
        // CHAT
        // =============================

        public async Task SendMessage(string conversationId, string content)
        {
            var userId = GetUserId();

            // Call Application layer
            var result = await _mediator.Send(new SendMessageCommand
            {
                ConversationId = long.Parse(conversationId),
                Content = content,
                UserId = Guid.Parse(userId)
            });

            // Broadcast to group
            await Clients.Group(conversationId)
                .SendAsync("ReceiveMessage", result);
        }

        // =============================
        // TYPING (optional)
        // =============================

        public async Task Typing(string conversationId)
        {
            var userId = GetUserId();

            await Clients.OthersInGroup(conversationId)
                .SendAsync("UserTyping", userId);
        }
    }
}