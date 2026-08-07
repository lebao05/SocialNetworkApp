using Application.Shared;

namespace Application.DTOs.Friends;

/// <summary>
/// Response DTO shared by GetFriends and GetMutualFriends. Paged list
/// of users enriched with mutual-count and request-status flags.
/// </summary>
public sealed record GetFriendsResponseDto(
    Guid Id,
    string UserName,
    string FullName,
    string? AvatarUrl,
    int MutualFriendsCount,
    bool IsFriend,
    bool IsSendingFriendRequest);

public sealed record GetFriendsPagedResponseDto(
    IReadOnlyList<GetFriendsResponseDto> Items,
    int PageNumber,
    int PageSize,
    int TotalCount)
{
    public static GetFriendsPagedResponseDto FromPagedList(
        PagedList<GetFriendsResponseDto> paged) =>
        new(paged.Items, paged.PageNumber, paged.PageSize, paged.TotalCount);
}