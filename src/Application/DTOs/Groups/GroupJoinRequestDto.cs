using Domain.Enums;

namespace Application.DTOs.Groups
{
    public sealed record GroupJoinRequestDto(
        long Id,
        long GroupId,
        Guid UserId,
        string FullName,
        string? AvatarUrl,
        string? Email,
        GroupRequestStatus Status,
        DateTime RequestedAt
    );
}
