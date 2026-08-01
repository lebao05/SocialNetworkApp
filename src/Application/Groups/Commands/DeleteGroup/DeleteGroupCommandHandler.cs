using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Groups;
using Domain.Shared;

namespace Application.Groups.Commands.DeleteGroup
{
    internal sealed class DeleteGroupCommandHandler : ICommandHandler<DeleteGroupCommand>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteGroupCommandHandler(
            IGroupRepository groupRepository,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(DeleteGroupCommand request, CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdAsync(request.GroupId, cancellationToken);
            if (group is null)
            {
                return Result.Failure(new Error(
                    "Group.NotFound",
                    "Group was not found."));
            }

            // Reject when the group is already soft-deleted or locked.
            var inactive = GroupGuard.EnsureActive(group);
            if (inactive is not null)
            {
                return Result.Failure(inactive);
            }

            // Only the group owner can delete the group.
            if (group.OwnerUserId != request.RequesterUserId)
            {
                return Result.Failure(new Error(
                    "Group.AccessDenied",
                    "Only the group owner can delete this group."));
            }

            group.MarkDeleted();

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
