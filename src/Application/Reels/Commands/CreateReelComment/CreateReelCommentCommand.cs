using Application.Abstractions.Messaging;

namespace Application.Reels.Commands.CreateReelComment;

public sealed record CreateReelCommentCommand(
    long ReelId,
    Guid UserId,
    string Content,
    long? ParentCommentId = null,
    Guid? RepliedUserId = null
) : ICommand<long>;
