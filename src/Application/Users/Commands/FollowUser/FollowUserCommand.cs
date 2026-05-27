using Application.Abstractions.Messaging;

namespace Application.Users.Commands.FollowUser
{
    public sealed record FollowUserCommand(
        Guid FollowerId,
        Guid FolloweeId
    ) : ICommand;
}
