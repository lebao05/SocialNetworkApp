using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Enums;
using Domain.Shared;

namespace Application.Groups.Commands.ReviewGroupJoinRequest
{
    internal sealed class ReviewGroupJoinRequestCommandHandler : ICommandHandler<ReviewGroupJoinRequestCommand>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ReviewGroupJoinRequestCommandHandler(
            IGroupRepository groupRepository,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(ReviewGroupJoinRequestCommand request, CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdWithMembersAsync(request.GroupId, cancellationToken);
            if (group is null)
            {
                return Result.Failure(new Error(
                    "Group.NotFound",
                    $"Group with id {request.GroupId} was not found."));
            }

            // Check if requester has admin/moderator permissions in the group
            if (!group.IsModeratorOrAdmin(request.RequesterUserId))
            {
                return Result.Failure(new Error(
                    "Group.AccessDenied",
                    "Only the group owner, admins, or moderators can review join requests."));
            }

            // Find the pending join request
            var joinRequest = group.Requests.FirstOrDefault(
                r => r.Id == request.RequestId && r.Status == GroupRequestStatus.Pending);

            if (joinRequest is null)
            {
                return Result.Failure(new Error(
                    "GroupJoinRequest.NotFound",
                    $"Pending join request with id {request.RequestId} was not found."));
            }

            if (request.Approve)
            {
                group.ApproveJoinRequest(request.RequestId);
            }
            else
            {
                group.RejectJoinRequest(request.RequestId);
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
