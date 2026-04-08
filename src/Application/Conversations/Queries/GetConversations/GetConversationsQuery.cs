using Application.Abstractions.Messaging;
using Application.DTOs.Conversations;
using Application.Shared;

namespace Application.Conversations.Queries.GetConversations
{
    public sealed record GetConversationsQuery(
        Guid UserId,
        int PageSize = 20,
        int PageNumber = 1) : IQuery<PagedList<ConversationResponse>>;
}
