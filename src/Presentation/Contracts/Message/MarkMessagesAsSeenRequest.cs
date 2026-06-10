namespace Presentation.Contracts.Message;

public sealed record MarkMessagesAsSeenRequest(long LastReadMessageId);
