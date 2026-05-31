using Application.Abstractions.Messaging;
using Domain.Enums;

namespace Application.Groups.Commands.UpdateGroup
{
    public sealed record UpdateGroupCommand(
        Guid RequesterUserId,
        long GroupId,
        string Name,
        string? Description,
        GroupPrivacyType PrivacyType,
        bool IsHidden,
        bool IsPostApprovalRequired,
        bool IsGroupJoinApprovalRequired,
        bool AllowAnonymousPost) : ICommand;
}
