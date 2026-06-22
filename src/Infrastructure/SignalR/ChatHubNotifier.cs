using Application.Abstractions.SignalR;
using Application.DTOs.Conversations;
using Application.DTOs.Messages;
using Microsoft.AspNetCore.SignalR;

namespace Infrastructure.SignalR;

public class ChatHubNotifier : IChatHubNotifier
{
    private readonly IHubContext<ChatHub> _hubContext;
    private readonly IPresenceTracker _presenceTracker;

    public ChatHubNotifier(IHubContext<ChatHub> hubContext, IPresenceTracker presenceTracker)
    {
        _hubContext = hubContext;
        _presenceTracker = presenceTracker;
    }

    public async Task AddConnectionsToGroupAsync(
        long conversationId,
        IReadOnlyList<Guid> userIds,
        CancellationToken cancellationToken = default)
    {
        var groupName = conversationId.ToString();

        foreach (var userId in userIds)
        {
            var connectionIds = _presenceTracker.GetConnections(userId.ToString());

            foreach (var connectionId in connectionIds)
            {
                await _hubContext.Groups.AddToGroupAsync(connectionId, groupName, cancellationToken);
            }
        }
    }

    public async Task NotifyMemberAddedAsync(
        long conversationId,
        ConversationMemberDto member,
        IReadOnlyList<Guid> recipientUserIds,
        CancellationToken cancellationToken = default)
    {
        var groupName = conversationId.ToString();
        await _hubContext.Clients
            .Group(groupName)
            .SendAsync(
                "MemberAdded",
                new
                {
                    conversationId,
                    member
                },
                cancellationToken);
    }

    public async Task NotifyMemberRemovedAsync(
        long conversationId,
        Guid removedUserId,
        IReadOnlyList<Guid> recipientUserIds,
        CancellationToken cancellationToken = default)
    {
        var groupName = conversationId.ToString();
        await _hubContext.Clients
            .Group(groupName)
            .SendAsync(
                "MemberRemoved",
                new
                {
                    conversationId,
                    removedUserId
                },
                cancellationToken);
    }

    public async Task NotifyConversationUpdatedAsync(
        long conversationId,
        ConversationDetailDto conversation,
        CancellationToken cancellationToken = default)
    {
        var groupName = conversationId.ToString();
        await _hubContext.Clients
            .Group(groupName)
            .SendAsync(
                "ConversationUpdated",
                new
                {
                    conversationId,
                    conversation
                },
                cancellationToken);
    }

    public async Task NotifySystemMessageSentAsync(
        long conversationId,
        MessageDto systemMessage,
        CancellationToken cancellationToken = default)
    {
        var groupName = conversationId.ToString();
        await _hubContext.Clients
            .Group(groupName)
            .SendAsync("ReceiveMessage", systemMessage, cancellationToken);
    }
}
