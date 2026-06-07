using Domain.Enums;

namespace Presentation.Contracts.Story;

public sealed class CreateStoryRequest
{
    public string? MediaUrl { get; init; }
    public StoryMediaType MediaType { get; init; }
    public string? BackgroundGradient { get; init; }
    public string? TextContent { get; init; }
    public string? TextColor { get; init; }
    public string? TextStyle { get; init; }
    public string? TextPositionX { get; init; }
    public string? TextPositionY { get; init; }
    public string? FontFamily { get; init; }
}
