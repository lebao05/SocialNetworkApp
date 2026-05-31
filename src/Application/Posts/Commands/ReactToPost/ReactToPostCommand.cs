using Application.Abstractions.Messaging;
using Domain.Enums;

namespace Application.Posts.Commands.ReactToPost
{
    public sealed record ReactToPostCommand(
        long PostId,
        Guid UserId,
        ReactionType? ReactionType
    ) : ICommand<long>;
}
