using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Posts.Commands.UnsavePost
{
    internal sealed class UnsavePostCommandHandler : ICommandHandler<UnsavePostCommand, long>
    {
        private readonly IPostRepository _postRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UnsavePostCommandHandler(
            IPostRepository postRepository,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork)
        {
            _postRepository = postRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<long>> Handle(UnsavePostCommand request, CancellationToken cancellationToken)
        {
            var userExists = await _userRepository.ExistsAsync(request.UserId, cancellationToken);
            if (!userExists)
            {
                return Result.Failure<long>(new Error(
                    "User.NotFound",
                    $"The user with Id {request.UserId} was not found."));
            }

            var savedPost = await _postRepository.GetSavedPostAsync(request.PostId, request.UserId, cancellationToken);
            if (savedPost is null)
            {
                return Result.Success(request.PostId);
            }

            _postRepository.RemoveSavedPost(savedPost);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(request.PostId);
        }
    }
}
