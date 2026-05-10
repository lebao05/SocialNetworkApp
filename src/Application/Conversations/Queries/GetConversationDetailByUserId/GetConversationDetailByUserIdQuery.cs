using Application.Abstractions.Messaging;
using Application.DTOs.Conversations;
using System;

namespace Application.Conversations.Queries.GetConversationDetailByUserId
{
    public sealed record GetConversationDetailByUserIdQuery(Guid UserId, Guid TargetUserId) : IQuery<ConversationDetailDto>;
}
