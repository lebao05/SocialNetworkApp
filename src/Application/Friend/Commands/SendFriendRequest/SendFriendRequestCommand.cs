using Application.Abstractions.Messaging;

namespace Application.Friend.Commands.SendFriendRequest;

public sealed record SendFriendRequestCommand(
    Guid SenderId,
    Guid ReceiverId
) : ICommand<bool>;