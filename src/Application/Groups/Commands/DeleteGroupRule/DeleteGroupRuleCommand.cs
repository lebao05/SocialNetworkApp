using Application.Abstractions.Messaging;
using Domain.Shared;

namespace Application.Groups.Commands.DeleteGroupRule
{
    public sealed record DeleteGroupRuleCommand(
        Guid RequesterUserId,
        long GroupId,
        long RuleId) : ICommand;
}
