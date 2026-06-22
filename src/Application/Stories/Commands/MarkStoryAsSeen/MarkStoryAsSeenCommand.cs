using Application.Abstractions.Messaging;

namespace Application.Stories.Commands.MarkStoryAsSeen;

public sealed record MarkStoryAsSeenCommand(
    Guid UserId,
    long StoryId
) : ICommand<MarkStoryAsSeenResponse>;
