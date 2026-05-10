using Application.Abstractions.Messaging;
using Application.DTOs.Conversations;
namespace Application.Conversations.Queries.GetConversationDetail
{
    public sealed record GetConversationDetailQuery(long ConversationId, Guid UserId)
           : IQuery<ConversationDetailDto>;
}
