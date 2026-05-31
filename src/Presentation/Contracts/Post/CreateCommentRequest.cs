using System;

namespace Presentation.Contracts.Post
{
    public sealed record CreateCommentRequest(
        string Content,
        long? ParentCommentId = null,
        Guid? RepliedUserId = null
    );
}
