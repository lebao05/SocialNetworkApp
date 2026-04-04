namespace Presentation.Contracts.Conversations;

public sealed record CreateConversationRequest(
    List<Guid> ParticipantIds,
    string? Name);