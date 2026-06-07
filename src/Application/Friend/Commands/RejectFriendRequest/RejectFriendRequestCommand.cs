using Application.Abstractions.Messaging;

namespace Application.Friend.Commands.RejectFriendRequest;

public sealed record RejectFriendRequestCommand(
    long RequestId,
    Guid UserId
) : ICommand<bool>;
