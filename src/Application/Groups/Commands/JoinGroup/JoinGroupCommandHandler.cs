using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Enums;
using Domain.Shared;

namespace Application.Groups.Commands.JoinGroup
{
    internal sealed class JoinGroupCommandHandler : ICommandHandler<JoinGroupCommand>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public JoinGroupCommandHandler(
            IGroupRepository groupRepository,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(JoinGroupCommand request, CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdWithMembersAsync(request.GroupId, cancellationToken);
            if (group is null)
            {
                return Result.Failure(new Error(
                    "Group.NotFound",
                    $"Group with id {request.GroupId} was not found."));
            }

            var userExists = await _userRepository.ExistsAsync(request.UserId, cancellationToken);
            if (!userExists)
            {
                return Result.Failure(new Error(
                    "User.NotFound",
                    $"User with id {request.UserId} was not found."));
            }

            // Check if already a member
            if (group.Members.Any(m => m.UserId == request.UserId))
            {
                return Result.Failure(new Error(
                    "Group.AlreadyMember",
                    "You are already a member of this group."));
            }

            if (!group.IsGroupJoinApprovalRequired)
            {
                // Join immediately
                group.AddMember(request.UserId);
            }
            else
            {
                // Require approval: create a join request
                var existingPendingRequest = group.Requests.FirstOrDefault(
                    r => r.UserId == request.UserId && r.Status == GroupRequestStatus.Pending);

                if (existingPendingRequest is not null)
                {
                    return Result.Failure(new Error(
                        "Group.RequestPending",
                        "Your request to join this group is pending approval."));
                }

                group.AddJoinRequest(request.UserId);
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
