using Application.Abstractions.Messaging;

namespace Application.Friend.Commands.SyncAllFriends
{
    public sealed record SyncAllFriendsCommand() : ICommand<int>;
}
