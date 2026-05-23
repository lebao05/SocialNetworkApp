using Application.Abstractions.Messaging;

namespace Application.Posts.Commands.DeletePost
{
    public sealed record DeletePostCommand(
        long PostId,
        Guid UserId
    ) : ICommand;
}
