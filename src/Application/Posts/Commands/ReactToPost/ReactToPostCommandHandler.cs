using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Shared;

namespace Application.Posts.Commands.ReactToPost
{
    internal sealed class ReactToPostCommandHandler : ICommandHandler<ReactToPostCommand, long>
    {
        private readonly IPostRepository _postRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ReactToPostCommandHandler(
            IPostRepository postRepository,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork)
        {
            _postRepository = postRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<long>> Handle(ReactToPostCommand request, CancellationToken cancellationToken)
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

            var existingReaction = await _postRepository.GetPostReactionAsync(request.PostId, request.UserId, cancellationToken);
            if (existingReaction is not null)
            {
                if (request.ReactionType is null)
                {
                    _postRepository.RemoveReaction(existingReaction);
                }
                else
                {
                    existingReaction.UpdateReaction(request.ReactionType.Value);
                }

                await _unitOfWork.SaveChangesAsync(cancellationToken);
                return Result.Success(request.PostId);
            }

            if (request.ReactionType is null)
            {
                return Result.Success(request.PostId);
            }

            var reaction = new PostReaction(
                id: 0,
                userId: request.UserId,
                postId: request.PostId,
                reactionType: request.ReactionType.Value);

            _postRepository.AddReaction(reaction);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(request.PostId);
        }
    }
}
