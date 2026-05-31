using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Enums;
using Domain.Shared;

namespace Application.Groups.Commands.ExecuteReportedContent
{
    internal sealed class ExecuteReportedContentCommandHandler : ICommandHandler<ExecuteReportedContentCommand>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IPostRepository _postRepository;
        private readonly IGroupReportRepository _groupReportRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ExecuteReportedContentCommandHandler(
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

        public async Task<Result> Handle(ExecuteReportedContentCommand request, CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdWithMembersAsync(request.GroupId, cancellationToken);
            if (group is null)
            {
                return Result.Failure(new Error(
                    "Group.NotFound",
                    $"Group with id {request.GroupId} was not found."));
            }

            if (!group.IsModeratorOrAdmin(request.ReviewerUserId))
            {
                return Result.Failure(new Error(
                    "Group.AccessDenied",
                    "Only the group owner, admins, or moderators can execute reported content."));
            }

            var report = await _groupReportRepository.GetByIdAsync(request.ReportId, cancellationToken);
            if (report is null)
            {
                return Result.Failure(new Error(
                    "GroupReport.NotFound",
                    $"Report with id {request.ReportId} was not found."));
            }

            if (report.GroupId != request.GroupId)
            {
                return Result.Failure(new Error(
                    "GroupReport.GroupMismatch",
                    "The report does not belong to this group."));
            }

            if (report.Status != GroupReportStatus.Pending)
            {
                return Result.Failure(new Error(
                    "GroupReport.AlreadyExecuted",
                    "Only pending reports can be executed."));
            }

            var post = await _postRepository.GetByIdAsync(report.PostId, cancellationToken);
            if (post is null)
            {
                return Result.Failure(new Error(
                    "Post.NotFound",
                    $"Post with id {report.PostId} was not found."));
            }

            if (post.GroupId != request.GroupId)
            {
                return Result.Failure(new Error(
                    "Post.GroupMismatch",
                    "The reported post does not belong to this group."));
            }

            if (request.HidePost)
            {
                post.HideFromGroup(request.ReviewNote);
                report.Review(request.ReviewerUserId, request.ReviewNote);
            }
            else
            {
                report.Dismiss(request.ReviewerUserId, request.ReviewNote);
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
