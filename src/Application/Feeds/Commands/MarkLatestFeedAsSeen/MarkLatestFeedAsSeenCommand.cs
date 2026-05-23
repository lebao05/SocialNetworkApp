using Application.Abstractions.Messaging;

namespace Application.Feeds.Commands.MarkLatestFeedAsSeen
{
    public sealed record MarkLatestFeedAsSeenCommand(
        Guid UserId,
        int Count = 10
    ) : ICommand<int>;
}
