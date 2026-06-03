using Domain.Enums;

namespace Application.DTOs.Groups
{
    public sealed record GroupDetailDto(
        long Id,
        Guid OwnerUserId,
        string Name,
        string? Description,
        GroupPrivacyType PrivacyType,
        string? CoverPhotoUrl,
        bool IsPostApprovalRequired,
        bool IsGroupJoinApprovalRequired,
        bool AllowAnonymousPost,
        int MemberCount,
        string? Role,
        bool IsOwner,
        bool IsMember,
        DateTime CreatedAt);
}
