namespace Application.Stories.Commands.ToggleStoryLike;

public sealed record ToggleStoryLikeResponse(
    bool IsLiked,
    int LikeCount
);
