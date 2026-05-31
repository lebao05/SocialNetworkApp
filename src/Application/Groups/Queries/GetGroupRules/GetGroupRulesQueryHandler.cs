using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Groups;
using Domain.Shared;

namespace Application.Groups.Queries.GetGroupRules
{
    internal sealed class GetGroupRulesQueryHandler : IQueryHandler<GetGroupRulesQuery, List<GroupRuleResponse>>
    {
        private readonly IGroupRepository _groupRepository;

        public GetGroupRulesQueryHandler(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public async Task<Result<List<GroupRuleResponse>>> Handle(GetGroupRulesQuery request, CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdWithMembersAsync(request.GroupId, cancellationToken);
            if (group is null)
            {
                return Result.Failure<List<GroupRuleResponse>>(new Error(
                    "Group.NotFound",
                    $"Group with id {request.GroupId} was not found."));
            }

            var response = group.Rules
                .Select(r => new GroupRuleResponse(r.Id, r.GroupId, r.Title, r.Description))
                .ToList();

            return Result.Success(response);
        }
    }
}
