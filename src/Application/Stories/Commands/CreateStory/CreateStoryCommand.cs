using Application.Abstractions.Messaging;
using Domain.Enums;

namespace Application.Stories.Commands.CreateStory;

public sealed record CreateStoryCommand(
    Guid UserId,
    string? MediaUrl,
    StoryMediaType MediaType,
    string? BackgroundGradient,
    string? TextContent,
    string? TextColor,
    string? TextStyle,
    string? TextPositionX,
    string? TextPositionY,
    string? FontFamily
) : ICommand<long>;
