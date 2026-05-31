using Application.Abstractions.Messaging;

namespace Application.Groups.Commands.ReviewGroupPost
{
    public sealed record ReviewGroupPostCommand(
        Guid RequesterUserId,
        long GroupId,
        long PostId,
        bool Approve) : ICommand;
}
