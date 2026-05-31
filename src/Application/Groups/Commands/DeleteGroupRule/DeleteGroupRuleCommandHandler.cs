using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Groups.Commands.DeleteGroupRule
{
    internal sealed class DeleteGroupRuleCommandHandler : ICommandHandler<DeleteGroupRuleCommand>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteGroupRuleCommandHandler(
            IGroupRepository groupRepository,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(DeleteGroupRuleCommand request, CancellationToken cancellationToken)
        {
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

            group.RemoveRule(request.RuleId);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
