using System;

namespace Application.DTOs.Conversations
{
    public sealed record ConversationSearchResponse(
        string Id,
        string Name,
        string? ImageUrl,
        bool IsOneToOne,
        bool IsNotAConversation,
        Guid? OtherUserId);
}
