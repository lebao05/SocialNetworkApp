using Application.Abstractions.Messaging;

namespace Application.Friends.Commands.SendFriendRequest;

public sealed record SendFriendRequestCommand(
    Guid SenderId,
    Guid ReceiverId
) : ICommand<bool>;