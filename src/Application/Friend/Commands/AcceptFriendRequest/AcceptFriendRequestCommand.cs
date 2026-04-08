using Application.Abstractions.Messaging;

namespace Application.Friend.Commands.AcceptFriendRequest;

public sealed record AcceptFriendRequestCommand(
    long RequestId,
    Guid UserId
) : ICommand<bool>;