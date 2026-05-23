using Domain.Enums;

namespace Application.DTOs.Groups
{
    public sealed record GroupDto(
        long Id,
        Guid OwnerUserId,
        string Name,
        string? Description,
        GroupPrivacyType PrivacyType,
        string? CoverPhotoUrl
    );
}
