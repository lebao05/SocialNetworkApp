using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Groups;
using Domain.Shared;

namespace Application.Groups.Commands.UpdateGroup
{
    internal sealed class UpdateGroupCommandHandler : ICommandHandler<UpdateGroupCommand>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateGroupCommandHandler(
            IGroupRepository groupRepository,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(UpdateGroupCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return Result.Failure(new Error(
                    "Group.Validation",
                    "Group name is required."));
            }

            var group = await _groupRepository.GetByIdAsync(request.GroupId, cancellationToken);
            var inactive = GroupGuard.EnsureActive(group);
            if (inactive is not null)
            {
                return Result.Failure(inactive);
            }

            if (group!.OwnerUserId != request.RequesterUserId)
            {
                return Result.Failure(new Error(
                    "Group.Authorization",
                    "Only the group owner can update group settings."));
            }

            group.Update(
                request.Name,
                request.Description,
                request.PrivacyType,
                request.IsPostApprovalRequired,
                request.IsGroupJoinApprovalRequired,
                request.AllowAnonymousPost);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
