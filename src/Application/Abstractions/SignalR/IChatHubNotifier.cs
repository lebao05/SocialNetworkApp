using Application.Abstractions.SignalR;
using Application.DTOs.Conversations;
using Application.DTOs.Messages;

namespace Application.Abstractions.SignalR;

public interface IChatHubNotifier
{
    Task AddConnectionsToGroupAsync(long conversationId, IReadOnlyList<Guid> userIds, CancellationToken cancellationToken = default);
    Task NotifyMemberAddedAsync(long conversationId, ConversationMemberDto member, IReadOnlyList<Guid> recipientUserIds, CancellationToken cancellationToken = default);
    Task NotifyMemberRemovedAsync(long conversationId, Guid removedUserId, IReadOnlyList<Guid> recipientUserIds, CancellationToken cancellationToken = default);
    Task NotifyConversationUpdatedAsync(long conversationId, ConversationDetailDto conversation, CancellationToken cancellationToken = default);
    Task NotifySystemMessageSentAsync(long conversationId, MessageDto systemMessage, CancellationToken cancellationToken = default);
}
