using System.Linq;
using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Groups;
using Domain.Entities;
using Domain.Shared;

namespace Application.Groups.Commands.ReportGroupPost
{
    internal sealed class ReportGroupPostCommandHandler : ICommandHandler<ReportGroupPostCommand>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IPostRepository _postRepository;
        private readonly IGroupReportRepository _groupReportRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ReportGroupPostCommandHandler(
            IGroupRepository groupRepository,
            IPostRepository postRepository,
            IGroupReportRepository groupReportRepository,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _postRepository = postRepository;
            _groupReportRepository = groupReportRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(ReportGroupPostCommand request, CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdWithMembersAsync(request.GroupId, cancellationToken);
            var inactive = GroupGuard.EnsureActive(group);
            if (inactive is not null)
            {
                return Result.Failure(inactive);
            }

            var reporterIsGroupMember = group!.OwnerUserId == request.ReporterId
                || group.Members.Any(member => member.UserId == request.ReporterId);

            if (!reporterIsGroupMember)
            {
                return Result.Failure(new Error(
                    "Group.NotMember",
                    "You must be a member of the group to report a post."));
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

            var alreadyReported = await _groupReportRepository.ExistsAsync(
                request.ReporterId,
                request.PostId,
                cancellationToken);

            if (alreadyReported)
            {
                return Result.Failure(new Error(
                    "GroupReport.AlreadyReported",
                    "You have already reported this post."));
            }

            var report = new ReportedGroupContent(
                id: 0,
                groupId: request.GroupId,
                reporterId: request.ReporterId,
                postId: request.PostId,
                reason: request.Reason,
                additionalDetail: request.AdditionalDetail);

            _groupReportRepository.Add(report);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
