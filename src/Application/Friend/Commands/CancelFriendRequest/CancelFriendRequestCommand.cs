using Application.Abstractions.Messaging;

namespace Application.Friend.Commands.CancelFriendRequest;

public sealed record CancelFriendRequestCommand(
    Guid SenderId,
    Guid ReceiverId
) : ICommand;
