using Application.Abstractions.Messaging;
using Domain.Shared;

namespace Application.Groups.Commands.CreateGroupRule
{
    public sealed record CreateGroupRuleCommand(
        Guid RequesterUserId,
        long GroupId,
        string Title,
        string Description) : ICommand;
}
