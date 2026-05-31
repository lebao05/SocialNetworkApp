using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Shared;

namespace Application.Posts.Commands.ReactToComment
{
    internal sealed class ReactToCommentCommandHandler : ICommandHandler<ReactToCommentCommand, long>
    {
        private readonly IPostRepository _postRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ReactToCommentCommandHandler(
            IPostRepository postRepository,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork)
        {
            _postRepository = postRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<long>> Handle(ReactToCommentCommand request, CancellationToken cancellationToken)
        {
            var userExists = await _userRepository.ExistsAsync(request.UserId, cancellationToken);
            if (!userExists)
            {
                return Result.Failure<long>(new Error(
                    "User.NotFound",
                    $"The user with Id {request.UserId} was not found."));
            }

            var existingReaction = await _postRepository.GetCommentReactionAsync(request.CommentId, request.UserId, cancellationToken);
            if (existingReaction is not null)
            {
                if (request.ReactionType is null)
                {
                    _postRepository.RemoveCommentReaction(existingReaction);
                }
                else
                {
                    existingReaction.UpdateReaction(request.ReactionType.Value);
                }

                await _unitOfWork.SaveChangesAsync(cancellationToken);
                return Result.Success(request.CommentId);
            }

            if (request.ReactionType is null)
            {
                return Result.Success(request.CommentId);
            }

            var reaction = new CommentReaction(
                id: 0,
                userId: request.UserId,
                commentId: request.CommentId,
                reactionType: request.ReactionType.Value);

            _postRepository.AddCommentReaction(reaction);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Success(request.CommentId);
        }
    }
}
