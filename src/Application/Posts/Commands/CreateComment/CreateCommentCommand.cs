using Application.Abstractions.Messaging;

namespace Application.Posts.Commands.CreateComment
{
    public sealed record CreateCommentCommand(
        long PostId,
        Guid UserId,
        string Content,
        long? ParentCommentId = null,
        Guid? RepliedUserId = null
    ) : ICommand<long>;
}
