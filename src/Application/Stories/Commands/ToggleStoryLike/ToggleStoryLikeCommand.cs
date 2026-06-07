using Application.Abstractions.Messaging;

namespace Application.Stories.Commands.ToggleStoryLike;

public sealed record ToggleStoryLikeCommand(
    Guid UserId,
    long StoryId
) : ICommand<ToggleStoryLikeResponse>;
