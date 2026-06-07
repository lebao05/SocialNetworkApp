using Application.Abstractions.Messaging;

namespace Application.Reels.Commands.ToggleLikeReel
{
    public sealed record ToggleLikeReelCommand(
        Guid UserId,
        long ReelId
    ) : ICommand<ToggleLikeReelResponse>;
}
