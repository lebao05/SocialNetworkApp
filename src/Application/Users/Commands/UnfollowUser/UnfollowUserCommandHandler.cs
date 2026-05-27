using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Users.Commands.UnfollowUser
{
    internal sealed class UnfollowUserCommandHandler : ICommandHandler<UnfollowUserCommand>
    {
        private readonly IFriendshipRepository _friendshipRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UnfollowUserCommandHandler(
            IFriendshipRepository friendshipRepository,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork)
        {
            _friendshipRepository = friendshipRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(UnfollowUserCommand request, CancellationToken cancellationToken)
        {
            if (request.FollowerId == request.FolloweeId)
            {
                return Result.Failure(new Error("Unfollow.Self", "A user cannot unfollow themselves."));
            }

            var followerExists = await _userRepository.ExistsAsync(request.FollowerId, cancellationToken);
            if (!followerExists)
            {
                return Result.Failure(new Error("User.NotFound", $"The follower with Id {request.FollowerId} was not found."));
            }

            var followeeExists = await _userRepository.ExistsAsync(request.FolloweeId, cancellationToken);
            if (!followeeExists)
            {
                return Result.Failure(new Error("User.NotFound", $"The followee with Id {request.FolloweeId} was not found."));
            }

            await _friendshipRepository.RemoveFollowingAsync(request.FollowerId, request.FolloweeId, cancellationToken);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
