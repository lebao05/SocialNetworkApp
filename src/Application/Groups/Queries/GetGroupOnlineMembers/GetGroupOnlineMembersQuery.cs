using Application.Abstractions.Messaging;
using Application.DTOs.Users;

namespace Application.Groups.Queries.GetGroupOnlineMembers
{
    public sealed record GetGroupOnlineMembersQuery(
        long GroupId
    ) : IQuery<GroupOnlineStatusDto>;

    public sealed record GroupOnlineStatusDto(
        int OnlineCount,
        List<UserSummaryDto> OnlineMembers
    );
}
