using Application.DTOs.Groups;
using Domain.Enums;
using System.Collections.Generic;

namespace Application.DTOs.Posts
{
    public sealed record PostDto(
        long Id,
        Guid AuthorId,
        string AuthorName,
        string? AuthorAvatarUrl,
        long? GroupId,
        string? Content,
        PostVisibility Visibility,
        long? SharePostId,
        string? LocationTag,
        Feeling? FeelingActivity,
        DateTime CreatedAt,
        DateTime? UpdatedAt,
        DateTime? DeletedAt,
        IReadOnlyCollection<PostMediaDto> Media,
        GroupDto? Group,
        PostDto? SharePost
    );
}
