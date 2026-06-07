namespace Application.DTOs.Stories;

public sealed record StoryTimelineUserPageItem(
    Guid UserId,
    bool HasUnseenStories);
