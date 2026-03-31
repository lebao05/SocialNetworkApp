using Application.Abstractions.Messaging;

namespace Application.Friends.Commands.AcceptFriendRequest;

public sealed record AcceptFriendRequestCommand(
    long RequestId,
    Guid UserId
) : ICommand<bool>;