using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Groups;
using Application.Shared;
using Domain.Entities;
using Domain.Shared;

namespace Application.Groups.Queries.GetGroupMembers
{
    internal sealed class GetGroupMembersQueryHandler : IQueryHandler<GetGroupMembersQuery, PagedList<GroupMemberDto>>
    {
        private readonly IGroupRepository _groupRepository;

        public GetGroupMembersQueryHandler(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public async Task<Result<PagedList<GroupMemberDto>>> Handle(GetGroupMembersQuery request, CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdAsync(request.GroupId, cancellationToken);
            if (group is null)
            {
                return Result.Failure<PagedList<GroupMemberDto>>(new Error(
                    "Group.NotFound",
                    $"Group with id {request.GroupId} was not found."));
            }

            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 100);
            var members = await _groupRepository.GetMembersPagedAsync(
                request.GroupId,
                page,
                pageSize,
                request.SearchTerm,
                request.Role,
                cancellationToken);

            return Result.Success(new PagedList<GroupMemberDto>(
                members.Items.Select(Map).ToList(),
                members.PageNumber,
                members.PageSize,
                members.TotalCount));
        }

        private static GroupMemberDto Map(GroupMember member)
        {
            return new GroupMemberDto(
                member.Id,
                member.GroupId,
                member.UserId,
                member.User is null ? string.Empty : $"{member.User.FirstName} {member.User.LastName}",
                member.User?.AvatarUrl,
                member.User?.Email,
                member.Role,
                member.CreatedAt);
        }
    }
}
