using Application.Abstractions.Messaging;
using Domain.Enums;

namespace Application.Posts.Commands.ReactToComment
{
    public sealed record ReactToCommentCommand(
        long CommentId,
        Guid UserId,
        ReactionType? ReactionType
    ) : ICommand<long>;
}
