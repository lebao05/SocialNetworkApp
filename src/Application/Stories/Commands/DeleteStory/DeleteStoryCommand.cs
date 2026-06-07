using Application.Abstractions.Messaging;

namespace Application.Stories.Commands.DeleteStory;

public sealed record DeleteStoryCommand(
    Guid UserId,
    long StoryId
) : ICommand;

