using Application.DTOs.Groups;
using Domain.Enums;

namespace Application.DTOs.Posts
{
    public sealed record PostDto(
        long Id,
        Guid AuthorId,
        long? GroupId,
        string? Content,
        PostVisibility Visibility,
        long? SharePostId,
        string? LocationTag,
        string? FeelingActivity,
        DateTime CreatedAt,
        DateTime? UpdatedAt,
        DateTime? DeletedAt,
        GroupDto? Group,
        PostDto? SharePost
    );
}
