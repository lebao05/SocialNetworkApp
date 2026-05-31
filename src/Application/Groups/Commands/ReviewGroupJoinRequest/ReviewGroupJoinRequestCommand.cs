using Application.Abstractions.Messaging;
using Domain.Shared;

namespace Application.Groups.Commands.ReviewGroupJoinRequest
{
    public sealed record ReviewGroupJoinRequestCommand(
        Guid RequesterUserId,
        long GroupId,
        long RequestId,
        bool Approve) : ICommand;
}
