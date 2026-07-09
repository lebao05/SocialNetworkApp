using Domain.Enums;

namespace Application.DTOs.Search
{
    public sealed record SearchGroupDto(
        long Id,
        string Name,
        string? CoverPhotoUrl,
        GroupPrivacyType PrivacyType,
        int MemberCount
    );
}
