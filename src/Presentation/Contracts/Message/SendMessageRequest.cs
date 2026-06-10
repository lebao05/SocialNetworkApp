using Microsoft.AspNetCore.Http;

namespace Presentation.Contracts.Message
{
    public sealed record SendMessageRequest(
        long ConversationId,
        string? Content,
        IFormFileCollection? Files);
}
