namespace Application.DTOs.Admin;

/// <summary>
/// One row of the admin Groups page.
/// </summary>
public sealed record AdminGroupRowDto(
    long Id,
    string Name,
    string PrivacyType,
    string? CoverPhotoUrl,
    string OwnerDisplayName,
    int MemberCount,
    int PostCount,
    bool IsLocked,
    DateTime CreatedAt);

public sealed record AdminGroupListDto(
    IReadOnlyList<AdminGroupRowDto> Items,
    int Page,
    int PageSize,
    int TotalCount);