namespace Presentation.Contracts.Conversations;

public sealed record AddMemberToConversationRequest(
    Guid UserIdToAdd);
