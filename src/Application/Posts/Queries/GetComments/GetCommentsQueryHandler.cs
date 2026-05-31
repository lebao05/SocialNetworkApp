using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Posts;
using Application.Shared;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;

namespace Application.Posts.Queries.GetComments
{
    internal sealed class GetCommentsQueryHandler : IQueryHandler<GetCommentsQuery, PagedList<PostCommentDto>>
    {
        private readonly IPostRepository _postRepository;

        public GetCommentsQueryHandler(IPostRepository postRepository)
        {
            _postRepository = postRepository;
        }

        public async Task<Result<PagedList<PostCommentDto>>> Handle(GetCommentsQuery request, CancellationToken cancellationToken)
        {
            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 100);

            var post = await _postRepository.GetByIdAsync(request.PostId, cancellationToken);
            if (post is null)
            {
                return Result.Failure<PagedList<PostCommentDto>>(new Error(
                    "Post.NotFound",
                    $"The post with Id {request.PostId} was not found."));
            }

            if (request.ParentCommentId.HasValue)
            {
                var parentComment = await _postRepository.GetCommentByIdAsync(request.ParentCommentId.Value, cancellationToken);
                if (parentComment is null)
                {
                    return Result.Failure<PagedList<PostCommentDto>>(new Error(
                        "Comment.ParentNotFound",
                        $"The parent comment with Id {request.ParentCommentId.Value} was not found."));
                }

                if (parentComment.PostId != request.PostId)
                {
                    return Result.Failure<PagedList<PostCommentDto>>(new Error(
                        "Comment.ParentMismatch",
                        "The parent comment must belong to the requested post."));
                }
            }

            var comments = await _postRepository.GetCommentsPagedAsync(
                request.PostId,
                request.ParentCommentId,
                page,
                pageSize,
                cancellationToken);

            var commentIds = comments.Items.Select(c => c.Id).ToList();
            var replyCounts = await _postRepository.GetReplyCountsAsync(commentIds, cancellationToken);

            var items = comments.Items
                .Select(comment => Map(comment, request.UserId, replyCounts.GetValueOrDefault(comment.Id, 0)))
                .ToList();

            return Result.Success(new PagedList<PostCommentDto>(
                items,
                comments.PageNumber,
                comments.PageSize,
                comments.TotalCount));
        }

        private static PostCommentDto Map(PostComment comment, Guid? userId, int replyCount)
        {
            return new PostCommentDto(
                comment.Id,
                comment.PostId,
                comment.UserId,
                comment.User != null ? $"{comment.User.FirstName} {comment.User.LastName}" : "User",
                comment.User?.AvatarUrl,
                comment.ParentCommentId,
                comment.RepliedUserId,
                comment.RepliedUser != null ? $"{comment.RepliedUser.FirstName} {comment.RepliedUser.LastName}" : null,
                comment.RepliedUser?.AvatarUrl,
                comment.Content,
                comment.CreatedAt,
                comment.UpdatedAt,
                MapReactionCounts(comment),
                replyCount,
                GetUserReaction(comment, userId));
        }

        private static IReadOnlyCollection<ReactionCountDto> MapReactionCounts(PostComment comment)
        {
            return comment.Reactions
                .GroupBy(reaction => reaction.ReactionType)
                .Select(group => new ReactionCountDto(group.Key, group.Count()))
                .ToList();
        }

        private static ReactionType? GetUserReaction(PostComment comment, Guid? userId)
        {
            if (!userId.HasValue)
            {
                return null;
            }

            return comment.Reactions
                .FirstOrDefault(reaction => reaction.UserId == userId.Value)
                ?.ReactionType;
        }
    }
}
