using Application.Abstractions.Messaging;
using Application.DTOs.Conversations;

namespace Application.Conversations.Queries.GetConversationMembers;

public sealed record GetConversationMembersQuery(
    Guid CurrentUserId,
    long ConversationId,
    int PageNumber = 1,
    int PageSize = 20
) : IQuery<List<ConversationMemberDto>>;
