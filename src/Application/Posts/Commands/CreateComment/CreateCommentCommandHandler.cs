using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Events;
using Domain.Shared;

namespace Application.Posts.Commands.CreateComment
{
    internal sealed class CreateCommentCommandHandler : ICommandHandler<CreateCommentCommand, long>
    {
        private readonly IPostRepository _postRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateCommentCommandHandler(
            IPostRepository postRepository,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork)
        {
            _postRepository = postRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<long>> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Content))
            {
                return Result.Failure<long>(new Error(
                    "Comment.Empty",
                    "Comment content cannot be empty."));
            }

            var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
            if (user == null)
            {
                return Result.Failure<long>(new Error(
                    "User.NotFound",
                    $"The user with Id {request.UserId} was not found."));
            }

            var post = await _postRepository.GetByIdAsync(request.PostId, cancellationToken);
            if (post is null)
            {
                return Result.Failure<long>(new Error(
                    "Post.NotFound",
                    $"The post with Id {request.PostId} was not found."));
            }

            PostComment? parentComment = null;
            if (request.ParentCommentId.HasValue)
            {
                parentComment = await _postRepository.GetCommentByIdAsync(request.ParentCommentId.Value, cancellationToken);
                if (parentComment is null)
                {
                    return Result.Failure<long>(new Error(
                        "Comment.ParentNotFound",
                        $"The parent comment with Id {request.ParentCommentId.Value} was not found."));
                }

                if (parentComment.PostId != request.PostId)
                {
                    return Result.Failure<long>(new Error(
                        "Comment.ParentMismatch",
                        "The parent comment must belong to the same post."));
                }

                if (parentComment.ParentCommentId.HasValue)
                {
                    return Result.Failure<long>(new Error(
                        "Comment.DepthExceeded",
                        "Comment replies are limited to one level of nesting."));
                }
            }

            if (request.RepliedUserId.HasValue)
            {
                var repliedUserExists = await _userRepository.ExistsAsync(request.RepliedUserId.Value, cancellationToken);
                if (!repliedUserExists)
                {
                    return Result.Failure<long>(new Error(
                        "User.RepliedUserNotFound",
                        $"The replied user with Id {request.RepliedUserId.Value} was not found."));
                }
            }
            else if (parentComment is not null)
            {
                request = request with { RepliedUserId = parentComment.UserId };
            }

            var comment = new PostComment(
                id: 0,
                postId: request.PostId,
                userId: request.UserId,
                parentCommentId: request.ParentCommentId,
                content: request.Content,
                repliedUserId: request.RepliedUserId);

            _postRepository.AddComment(comment);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Raise CommentCreatedDomainEvent
            user.AddDomainEvent(new CommentCreatedDomainEvent(
                CommentId: comment.Id,
                PostId: request.PostId,
                CommenterId: request.UserId,
                RepliedUserId: request.RepliedUserId,
                ParentCommentId: request.ParentCommentId,
                CreatedAt: DateTime.UtcNow
            ));

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(comment.Id);
        }
    }
}
