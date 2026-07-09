using Domain.Common;

namespace Domain.Events;

public sealed record CommentCreatedDomainEvent(
    long CommentId,
    long PostId,
    Guid CommenterId,
    Guid? RepliedUserId,
    long? ParentCommentId,
    DateTime CreatedAt
) : IDomainEvent;
