using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Posts.Commands.DeletePost
{
    internal sealed class DeletePostCommandHandler : ICommandHandler<DeletePostCommand>
    {
        private readonly IPostRepository _postRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeletePostCommandHandler(
            IPostRepository postRepository,
            IUnitOfWork unitOfWork)
        {
            _postRepository = postRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(DeletePostCommand request, CancellationToken cancellationToken)
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
                    "You do not have permission to delete this post."));
            }

            post.SoftDelete();
            _postRepository.Update(post);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
