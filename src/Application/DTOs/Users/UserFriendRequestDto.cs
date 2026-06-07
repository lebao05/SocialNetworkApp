using Domain.Enums;

namespace Application.DTOs.Users
{
    public sealed record UserFriendRequestDto(
        long Id,
        Guid SenderId,
        Guid ReceiverId,
        FriendRequestStatus Status,
        DateTime CreatedAt);
}
