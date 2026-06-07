using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Reels;
using Application.Shared;
using Domain.Entities;
using Domain.Shared;

namespace Application.Reels.Queries.GetReelComments
{
    internal sealed class GetReelCommentsQueryHandler : IQueryHandler<GetReelCommentsQuery, PagedList<ReelCommentDto>>
    {
        private readonly IReelRepository _reelRepository;

        public GetReelCommentsQueryHandler(IReelRepository reelRepository)
        {
            _reelRepository = reelRepository;
        }

        public async Task<Result<PagedList<ReelCommentDto>>> Handle(GetReelCommentsQuery request, CancellationToken cancellationToken)
        {
            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 100);

            var reel = await _reelRepository.GetByIdAsync(request.ReelId, cancellationToken);
            if (reel is null)
            {
                return Result.Failure<PagedList<ReelCommentDto>>(new Error(
                    "Reel.NotFound",
                    $"The reel with Id {request.ReelId} was not found."));
            }

            if (request.ParentCommentId.HasValue)
            {
                var parentComment = await _reelRepository.GetCommentByIdAsync(request.ParentCommentId.Value, cancellationToken);
                if (parentComment is null)
                {
                    return Result.Failure<PagedList<ReelCommentDto>>(new Error(
                        "Comment.ParentNotFound",
                        $"The parent comment with Id {request.ParentCommentId.Value} was not found."));
                }

                if (parentComment.ReelId != request.ReelId)
                {
                    return Result.Failure<PagedList<ReelCommentDto>>(new Error(
                        "Comment.ParentMismatch",
                        "The parent comment must belong to the requested reel."));
                }
            }

            var comments = await _reelRepository.GetCommentsPagedAsync(
                request.ReelId,
                request.ParentCommentId,
                page,
                pageSize,
                cancellationToken);

            var commentIds = comments.Items.Select(c => c.Id).ToList();
            var replyCounts = await _reelRepository.GetReplyCountsAsync(commentIds, cancellationToken);

            var items = comments.Items
                .Select(comment => Map(comment, replyCounts.GetValueOrDefault(comment.Id, 0)))
                .ToList();

            return Result.Success(new PagedList<ReelCommentDto>(
                items,
                comments.PageNumber,
                comments.PageSize,
                comments.TotalCount));
        }

        private static ReelCommentDto Map(ReelComment comment, int replyCount)
        {
            var userName = comment.User != null
                ? $"{comment.User.FirstName} {comment.User.LastName}".Trim()
                : "User";

            var repliedUserName = comment.RepliedUser != null
                ? $"{comment.RepliedUser.FirstName} {comment.RepliedUser.LastName}".Trim()
                : null;

            return new ReelCommentDto(
                comment.Id,
                comment.ReelId,
                comment.UserId,
                string.IsNullOrWhiteSpace(userName) ? "User" : userName,
                comment.User?.AvatarUrl,
                comment.ParentCommentId,
                comment.RepliedUserId,
                repliedUserName,
                comment.RepliedUser?.AvatarUrl,
                comment.Content,
                replyCount,
                comment.CreatedAt,
                comment.UpdatedAt);
        }
    }
}
