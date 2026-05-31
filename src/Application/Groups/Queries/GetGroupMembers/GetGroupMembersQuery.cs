using Application.Abstractions.Messaging;
using Application.DTOs.Groups;
using Application.Shared;
using Domain.Enums;

namespace Application.Groups.Queries.GetGroupMembers
{
    public sealed record GetGroupMembersQuery(
        long GroupId,
        int Page = 1,
        int PageSize = 20,
        string? SearchTerm = null,
        GroupMemberRole? Role = null) : IQuery<PagedList<GroupMemberDto>>;
}
