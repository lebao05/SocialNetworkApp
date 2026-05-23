using Domain.Enums;

namespace Application.DTOs.Friends
{
    public sealed record FriendRequestDto(
        long Id,
        Guid SenderId,
        string SenderFirstName,
        string SenderLastName,
        string? SenderAvatarUrl,
        Guid ReceiverId,
        FriendRequestStatus Status,
        DateTime CreatedAt
    );
}
