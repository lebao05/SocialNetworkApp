using Application.Abstractions.Messaging;

namespace Application.Friend.Commands.Unfriend;

public sealed record UnfriendCommand(
    Guid CurrentUserId,
    Guid FriendUserId
) : ICommand<bool>;
