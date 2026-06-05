using Application.Abstractions.Messaging;

namespace Application.Reels.Commands.MarkStoryAsSeen
{
    public sealed record MarkStoryAsSeenCommand(
        Guid UserId,
        long StoryId
    ) : ICommand;
}
