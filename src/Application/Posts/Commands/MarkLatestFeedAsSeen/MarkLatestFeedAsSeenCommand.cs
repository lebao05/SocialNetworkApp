using Application.Abstractions.Messaging;

using System.Collections.Generic;

namespace Application.Posts.Commands.MarkLatestFeedAsSeen
{
    public sealed record MarkLatestFeedAsSeenCommand(
        Guid UserId,
        List<long> FeedIds
    ) : ICommand<int>;
}
