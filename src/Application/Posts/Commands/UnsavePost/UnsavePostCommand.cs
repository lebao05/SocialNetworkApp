using Application.Abstractions.Messaging;

namespace Application.Posts.Commands.UnsavePost
{
    public sealed record UnsavePostCommand(
        long PostId,
        Guid UserId
    ) : ICommand<long>;
}
