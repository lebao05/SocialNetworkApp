using System.Linq;
using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Groups.Commands.LeaveGroup
{
    internal sealed class LeaveGroupCommandHandler : ICommandHandler<LeaveGroupCommand>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IUnitOfWork _unitOfWork;

        public LeaveGroupCommandHandler(
            IGroupRepository groupRepository,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(LeaveGroupCommand request, CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdWithMembersAsync(request.GroupId, cancellationToken);
            if (group is null)
            {
                return Result.Failure(new Error(
                    "Group.NotFound",
                    $"Group with id {request.GroupId} was not found."));
            }

            if (group.OwnerUserId == request.UserId)
            {
                return Result.Failure(new Error(
                    "Group.OwnerCannotLeave",
                    "The group owner cannot leave the group."));
            }

            if (!group.Members.Any(m => m.UserId == request.UserId))
            {
                return Result.Failure(new Error(
                    "Group.NotMember",
                    "You are not a member of this group."));
            }

            group.RemoveMember(request.UserId);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
