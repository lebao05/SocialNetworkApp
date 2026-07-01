namespace Presentation.Contracts.Reel;

public sealed record CreateReelCommentRequest(
    string Content,
    long? ParentCommentId = null,
    Guid? RepliedUserId = null
);
