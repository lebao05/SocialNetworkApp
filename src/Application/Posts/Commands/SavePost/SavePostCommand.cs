using Application.Abstractions.Messaging;

namespace Application.Posts.Commands.SavePost
{
    public sealed record SavePostCommand(
        long PostId,
        Guid UserId
    ) : ICommand<long>;
}
