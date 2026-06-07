namespace Application.DTOs.Stories;

public sealed record StoryTimelineUserDto(
    Guid UserId,
    string AuthorName,
    string? AuthorAvatarUrl,
    bool HasUnseenStories,
    List<StoryDto> Stories
);
