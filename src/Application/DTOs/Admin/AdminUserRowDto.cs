namespace Application.DTOs.Admin;

/// <summary>
/// One row of the admin Users page.
/// Lightweight projection — admin only needs to identify, lock/unlock,
/// and show enough info to scan the list quickly.
/// </summary>
public sealed record AdminUserRowDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string? AvatarUrl,
    bool IsLocked,
    bool IsAdmin,
    int PostCount,
    DateTime CreatedAt,
    DateTime? LastActiveAt);

public sealed record AdminUserListDto(
    IReadOnlyList<AdminUserRowDto> Items,
    int Page,
    int PageSize,
    int TotalCount);