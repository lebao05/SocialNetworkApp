using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Groups;
using Application.Shared;
using Domain.Entities;
using Domain.Shared;

namespace Application.Groups.Queries.GetGroupJoinRequests
{
    internal sealed class GetGroupJoinRequestsQueryHandler : IQueryHandler<GetGroupJoinRequestsQuery, PagedList<GroupJoinRequestDto>>
    {
        private readonly IGroupRepository _groupRepository;

        public GetGroupJoinRequestsQueryHandler(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public async Task<Result<PagedList<GroupJoinRequestDto>>> Handle(GetGroupJoinRequestsQuery request, CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdWithMembersAsync(request.GroupId, cancellationToken);
            if (group is null)
            {
                return Result.Failure<PagedList<GroupJoinRequestDto>>(new Error(
                    "Group.NotFound",
                    $"Group with id {request.GroupId} was not found."));
            }

            if (!group.IsModeratorOrAdmin(request.RequesterUserId))
            {
                return Result.Failure<PagedList<GroupJoinRequestDto>>(new Error(
                    "Group.AccessDenied",
                    "Only the group owner, admins, or moderators can view join requests."));
            }

            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 100);
            var joinRequests = await _groupRepository.GetJoinRequestsPagedAsync(
                request.GroupId,
                page,
                pageSize,
                request.SearchTerm,
                cancellationToken: cancellationToken);

            return Result.Success(new PagedList<GroupJoinRequestDto>(
                joinRequests.Items.Select(Map).ToList(),
                joinRequests.PageNumber,
                joinRequests.PageSize,
                joinRequests.TotalCount));
        }

        private static GroupJoinRequestDto Map(GroupJoinRequest request)
        {
            return new GroupJoinRequestDto(
                request.Id,
                request.GroupId,
                request.UserId,
                request.User is null ? string.Empty : $"{request.User.FirstName} {request.User.LastName}",
                request.User?.AvatarUrl,
                request.User?.Email,
                request.Status,
                request.CreatedAt);
        }
    }
}
