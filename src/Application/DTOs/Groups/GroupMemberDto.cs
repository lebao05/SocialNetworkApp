using Domain.Enums;

namespace Application.DTOs.Groups
{
    public sealed record GroupMemberDto(
        long Id,
        long GroupId,
        Guid UserId,
        string FullName,
        string? AvatarUrl,
        string? Email,
        GroupMemberRole Role,
        DateTime JoinedAt
    );
}
