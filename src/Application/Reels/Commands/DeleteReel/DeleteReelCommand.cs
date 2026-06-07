using Application.Abstractions.Messaging;

namespace Application.Reels.Commands.DeleteReel
{
    public sealed record DeleteReelCommand(
        Guid UserId,
        long ReelId
    ) : ICommand;
}
