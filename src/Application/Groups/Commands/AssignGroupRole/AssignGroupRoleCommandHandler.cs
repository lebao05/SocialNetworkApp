using System.Linq;
using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Enums;
using Domain.Shared;

namespace Application.Groups.Commands.AssignGroupRole
{
    internal sealed class AssignGroupRoleCommandHandler : ICommandHandler<AssignGroupRoleCommand>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IUnitOfWork _unitOfWork;

        public AssignGroupRoleCommandHandler(
            IGroupRepository groupRepository,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(AssignGroupRoleCommand request, CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdWithMembersAsync(request.GroupId, cancellationToken);
            if (group is null)
            {
                return Result.Failure(new Error(
                    "Group.NotFound",
                    $"Group with id {request.GroupId} was not found."));
            }

            if (group.OwnerUserId != request.RequesterUserId)
            {
                return Result.Failure(new Error(
                    "Group.Authorization",
                    "Only the group owner can assign roles to group members."));
            }

            if (group.OwnerUserId == request.TargetUserId)
            {
                return Result.Failure(new Error(
                    "Group.RoleAssignment",
                    "Cannot change the role of the group owner."));
            }

            var member = group.Members.FirstOrDefault(m => m.UserId == request.TargetUserId);
            if (member is null)
            {
                return Result.Failure(new Error(
                    "Group.MemberNotFound",
                    "The specified user is not a member of the group."));
            }

            if (member.Role == request.NewRole)
            {
                return Result.Success();
            }

            member.UpdateRole(request.NewRole);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
