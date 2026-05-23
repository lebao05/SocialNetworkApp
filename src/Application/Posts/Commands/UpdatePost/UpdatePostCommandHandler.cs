using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Posts.Commands.UpdatePost
{
    internal sealed class UpdatePostCommandHandler : ICommandHandler<UpdatePostCommand>
    {
        private readonly IPostRepository _postRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdatePostCommandHandler(
            IPostRepository postRepository,
            IUnitOfWork unitOfWork)
        {
            _postRepository = postRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(UpdatePostCommand request, CancellationToken cancellationToken)
        {
            var post = await _postRepository.GetByIdAsync(request.PostId, cancellationToken);
            if (post is null)
            {
                return Result.Failure(new Error(
                    "Post.NotFound",
                    $"The post with Id {request.PostId} was not found."));
            }

            if (post.AuthorId != request.UserId)
            {
                return Result.Failure(new Error(
                    "Post.Forbidden",
                    "You do not have permission to update this post."));
            }

            if (string.IsNullOrWhiteSpace(request.Content)
                && post.Media.Count == 0
                && !post.SharePostId.HasValue)
            {
                return Result.Failure(new Error(
                    "Post.Empty",
                    "A post must include content, an attachment, or a shared post."));
            }

            post.Update(
                request.Content,
                request.Visibility,
                request.LocationTag,
                request.FeelingActivity);

            _postRepository.Update(post);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
