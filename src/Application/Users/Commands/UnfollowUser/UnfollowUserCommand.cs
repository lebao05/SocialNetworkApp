using Application.Abstractions.Messaging;

namespace Application.Users.Commands.UnfollowUser
{
    public sealed record UnfollowUserCommand(
        Guid FollowerId,
        Guid FolloweeId
    ) : ICommand;
}
