namespace Presentation.Contracts.Conversations;

public sealed record UpdateConversationRequest(
    string? Name,
    string? Theme,
    string? DefaultReaction
);
