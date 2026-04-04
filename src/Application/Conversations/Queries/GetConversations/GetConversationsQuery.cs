using Application.Abstractions.Messaging;
using Application.DTOs.Conversations;

namespace Application.Conversations.Queries.GetConversations
{
    public sealed record GetConversationsQuery(Guid UserId)
        : IQuery<List<ConversationDTO>>;
}
