using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Groups;
using Domain.Shared;

namespace Application.Groups.Commands.CancelJoinRequest
{
    internal sealed class CancelJoinRequestCommandHandler : ICommandHandler<CancelJoinRequestCommand>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CancelJoinRequestCommandHandler(
            IGroupRepository groupRepository,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(CancelJoinRequestCommand request, CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdWithMembersAsync(request.GroupId, cancellationToken);
            var inactive = GroupGuard.EnsureActive(group);
            if (inactive is not null)
            {
                return Result.Failure(inactive);
            }

            var removed = group!.CancelPendingRequest(request.UserId);
            if (!removed)
            {
                return Result.Failure(new Error(
                    "Group.NoPendingRequest",
                    "You do not have a pending join request for this group."));
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
