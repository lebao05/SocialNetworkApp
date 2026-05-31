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

            var requesterIsOwner = group.OwnerUserId == request.RequesterUserId;
            var requesterMember = group.Members.FirstOrDefault(m => m.UserId == request.RequesterUserId);
            var requesterIsAdmin = requesterMember?.Role == GroupMemberRole.Admin;

            if (!requesterIsOwner && !requesterIsAdmin)
            {
                return Result.Failure(new Error(
                    "Group.Authorization",
                    "Only the group owner or an admin can assign roles to group members."));
            }

            if (member.Role == request.NewRole)
            {
                return Result.Success();
            }

            if (!requesterIsOwner)
            {
                var authorizationResult = AuthorizeAdminRoleChange(member.Role, request.NewRole);
                if (authorizationResult.IsFailure)
                {
                    return authorizationResult;
                }
            }

            member.UpdateRole(request.NewRole);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }

        private static Result AuthorizeAdminRoleChange(
            GroupMemberRole currentRole,
            GroupMemberRole newRole)
        {
            if (currentRole == GroupMemberRole.Admin)
            {
                return Result.Failure(new Error(
                    "Group.RoleAssignment",
                    "Admins cannot change another admin's role."));
            }

            if (newRole == GroupMemberRole.Admin)
            {
                return Result.Failure(new Error(
                    "Group.RoleAssignment",
                    "Admins cannot assign the admin role."));
            }

            if (newRole != GroupMemberRole.Member && newRole != GroupMemberRole.Moderator)
            {
                return Result.Failure(new Error(
                    "Group.RoleAssignment",
                    "Admins can only assign member or moderator roles."));
            }

            return Result.Success();
        }
    }
}
