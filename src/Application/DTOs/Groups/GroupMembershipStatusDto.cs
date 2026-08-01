namespace Application.DTOs.Groups
{
    public sealed record GroupMembershipStatusDto(
        bool IsMember,
        bool IsPendingRequest);
}
