using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Shared;

namespace Application.Posts.Commands.SavePost
{
    internal sealed class SavePostCommandHandler : ICommandHandler<SavePostCommand, long>
    {
        private readonly IPostRepository _postRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public SavePostCommandHandler(
            IPostRepository postRepository,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork)
        {
            _postRepository = postRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<long>> Handle(SavePostCommand request, CancellationToken cancellationToken)
        {
            var userExists = await _userRepository.ExistsAsync(request.UserId, cancellationToken);
            if (!userExists)
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

            var existingSave = await _postRepository.GetSavedPostAsync(request.PostId, request.UserId, cancellationToken);
            if (existingSave is not null)
            {
                return Result.Success(request.PostId);
            }

            var savedPost = new SavedPost(
                id: 0,
                userId: request.UserId,
                postId: request.PostId);

            _postRepository.AddSavedPost(savedPost);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(request.PostId);
        }
    }
}
