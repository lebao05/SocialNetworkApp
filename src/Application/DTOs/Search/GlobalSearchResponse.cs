using Application.DTOs.Conversations;
using System.Collections.Generic;

namespace Application.DTOs.Search
{
    public sealed record GlobalSearchResponse(
        List<ConversationSearchResponse> Results);
}
