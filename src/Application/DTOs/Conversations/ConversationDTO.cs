using System;
using System.Collections.Generic;
using System.Text;

namespace Application.DTOs.Conversations
{
    public sealed record ConversationDTO(
        long Id,
        string? Name,
        string? Theme,
        bool IsOneToOne,
        string? LastMessage,
        DateTime? LastMessageAt);
}
