using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Groups.Commands.UpdateGroupRule
{
    internal sealed class UpdateGroupRuleCommandHandler : ICommandHandler<UpdateGroupRuleCommand>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateGroupRuleCommandHandler(
            IGroupRepository groupRepository,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(UpdateGroupRuleCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Description))
            {
                return Result.Failure(new Error(
                    "GroupRule.Validation",
                    "Title and description are required."));
            }

            var group = await _groupRepository.GetByIdWithMembersAsync(request.GroupId, cancellationToken);
            if (group is null)
            {
                return Result.Failure(new Error(
                    "Group.NotFound",
                    $"Group with id {request.GroupId} was not found."));
            }

            // Check if requester has admin/moderator permissions in the group
            if (!group.IsModeratorOrAdmin(request.RequesterUserId))
            {
                return Result.Failure(new Error(
                    "Group.AccessDenied",
                    "Only the group owner, admins, or moderators can manage rules."));
            }

            var ruleExists = group.Rules.Any(r => r.Id == request.RuleId);
            if (!ruleExists)
            {
                return Result.Failure(new Error(
                    "GroupRule.NotFound",
                    $"Group rule with id {request.RuleId} was not found."));
            }

            group.UpdateRule(request.RuleId, request.Title, request.Description);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
