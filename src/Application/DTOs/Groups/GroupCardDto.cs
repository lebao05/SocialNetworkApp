namespace Application.DTOs.Groups;

public sealed record GroupCardDto(
    long Id,
    string Name,
    string? CoverPhotoUrl,
    string PrivacyType,
    int MemberCount,
    int AvgPostsLast30Days,
    List<GroupCardMemberDto> FriendPreview,
    int FriendCount
);

public sealed record GroupCardMemberDto(
    Guid UserId,
    string FullName,
    string? AvatarUrl
);
