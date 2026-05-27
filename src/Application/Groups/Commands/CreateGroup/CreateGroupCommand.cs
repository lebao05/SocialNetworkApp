using Application.Abstractions.Messaging;
using Domain.Enums;
using Domain.Shared;

namespace Application.Groups.Commands.CreateGroup
{
    public sealed record CreateGroupCommand(
        Guid OwnerUserId,
        string Name,
        GroupPrivacyType PrivacyType) : ICommand<long>;
}
