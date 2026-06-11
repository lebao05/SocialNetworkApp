using Application.Abstractions.SignalR;
using Application.DTOs.Conversations;

namespace Application.Abstractions.SignalR;

public interface IChatHubNotifier
{
    Task AddConnectionsToGroupAsync(long conversationId, IReadOnlyList<Guid> userIds, CancellationToken cancellationToken = default);
    Task NotifyMemberAddedAsync(long conversationId, ConversationMemberDto member, IReadOnlyList<Guid> recipientUserIds, CancellationToken cancellationToken = default);
    Task NotifyMemberRemovedAsync(long conversationId, Guid removedUserId, IReadOnlyList<Guid> recipientUserIds, CancellationToken cancellationToken = default);
}
