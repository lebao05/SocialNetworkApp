using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Enums;
using Domain.Shared;

namespace Application.Groups.Commands.ReviewGroupPost
{
    internal sealed class ReviewGroupPostCommandHandler : ICommandHandler<ReviewGroupPostCommand>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IPostRepository _postRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ReviewGroupPostCommandHandler(
            IGroupRepository groupRepository,
            IPostRepository postRepository,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _postRepository = postRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(ReviewGroupPostCommand request, CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdWithMembersAsync(request.GroupId, cancellationToken);
            if (group is null)
            {
                return Result.Failure(new Error(
                    "Group.NotFound",
                    $"Group with id {request.GroupId} was not found."));
            }

            if (!group.IsModeratorOrAdmin(request.RequesterUserId))
            {
                return Result.Failure(new Error(
                    "Group.AccessDenied",
                    "Only the group owner, admins, or moderators can review group posts."));
            }

            var post = await _postRepository.GetByIdAsync(request.PostId, cancellationToken);
            if (post is null)
            {
                return Result.Failure(new Error(
                    "Post.NotFound",
                    $"Post with id {request.PostId} was not found."));
            }

            if (post.GroupId != request.GroupId)
            {
                return Result.Failure(new Error(
                    "Post.GroupMismatch",
                    "The post does not belong to this group."));
            }

            if (post.ApprovalStatus != PostApprovalStatus.Pending)
            {
                return Result.Failure(new Error(
                    "Post.NotPendingReview",
                    "Only pending group posts can be reviewed."));
            }

            if (request.Approve)
            {
                post.Approve();
            }
            else
            {
                post.Reject();
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
