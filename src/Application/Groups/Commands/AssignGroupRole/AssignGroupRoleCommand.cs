using Application.Abstractions.Messaging;
using Domain.Enums;
using Domain.Shared;

namespace Application.Groups.Commands.AssignGroupRole
{
    public sealed record AssignGroupRoleCommand(
        Guid RequesterUserId,
        long GroupId,
        Guid TargetUserId,
        GroupMemberRole NewRole) : ICommand;
}
