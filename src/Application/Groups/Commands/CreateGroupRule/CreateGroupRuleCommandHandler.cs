using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Groups;
using Domain.Shared;

namespace Application.Groups.Commands.CreateGroupRule
{
    internal sealed class CreateGroupRuleCommandHandler : ICommandHandler<CreateGroupRuleCommand>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateGroupRuleCommandHandler(
            IGroupRepository groupRepository,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(CreateGroupRuleCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Description))
            {
                return Result.Failure(new Error(
                    "GroupRule.Validation",
                    "Title and description are required."));
            }

            var group = await _groupRepository.GetByIdWithMembersAsync(request.GroupId, cancellationToken);
            var inactive = GroupGuard.EnsureActive(group);
            if (inactive is not null)
            {
                return Result.Failure(inactive);
            }

            // Check if requester has admin/moderator permissions in the group
            if (!group!.IsModeratorOrAdmin(request.RequesterUserId))
            {
                return Result.Failure(new Error(
                    "Group.AccessDenied",
                    "Only the group owner, admins, or moderators can manage rules."));
            }

            group.AddRule(request.Title, request.Description);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
