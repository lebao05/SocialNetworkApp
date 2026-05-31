using Application.Abstractions.Messaging;
using Domain.Shared;

namespace Application.Groups.Commands.UpdateGroupRule
{
    public sealed record UpdateGroupRuleCommand(
        Guid RequesterUserId,
        long GroupId,
        long RuleId,
        string Title,
        string Description) : ICommand;
}
