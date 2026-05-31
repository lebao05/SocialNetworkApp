using System.Collections.Generic;
using Application.Abstractions.Messaging;
using Application.DTOs.Groups;

namespace Application.Groups.Queries.GetGroupRules
{
    public sealed record GetGroupRulesQuery(long GroupId) : IQuery<List<GroupRuleResponse>>;
}
