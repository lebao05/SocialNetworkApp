using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Groups;
using Domain.Enums;
using Domain.Shared;

namespace Application.Groups.Queries.GetGroupDetail
{
    internal sealed class GetGroupDetailQueryHandler : IQueryHandler<GetGroupDetailQuery, GroupDetailDto>
    {
        private readonly IGroupRepository _groupRepository;

        public GetGroupDetailQueryHandler(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public async Task<Result<GroupDetailDto>> Handle(GetGroupDetailQuery request, CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdWithMembersAsync(request.GroupId, cancellationToken);
            if (group is null || group.DeletedAt is not null)
            {
                return Result.Failure<GroupDetailDto>(new Error(
                    "Group.Deleted",
                    "This group has been deleted and is no longer available."));
            }

            var requesterMember = group.Members.FirstOrDefault(member => member.UserId == request.RequesterUserId);
            var isOwner = group.OwnerUserId == request.RequesterUserId;
            var role = requesterMember?.Role.ToString();

            if (role is null && isOwner)
            {
                role = GroupMemberRole.Admin.ToString();
            }

            var response = new GroupDetailDto(
                group.Id,
                group.OwnerUserId,
                group.Name,
                group.Description,
                group.PrivacyType,
                group.CoverPhotoUrl,
                group.IsPostApprovalRequired,
                group.IsGroupJoinApprovalRequired,
                group.AllowAnonymousPost,
                group.Members.Count,
                role,
                isOwner,
                requesterMember is not null || isOwner,
                group.IsLocked,
                group.DeletedAt is not null,
                group.CreatedAt);

            return Result.Success(response);
        }
    }
}
