using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Shared;

namespace Application.Users.Commands.FollowUser
{
    internal sealed class FollowUserCommandHandler : ICommandHandler<FollowUserCommand>
    {
        private readonly IFriendshipRepository _friendshipRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public FollowUserCommandHandler(
            IFriendshipRepository friendshipRepository,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork)
        {
            _friendshipRepository = friendshipRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(FollowUserCommand request, CancellationToken cancellationToken)
        {
            if (request.FollowerId == request.FolloweeId)
            {
                return Result.Failure(new Error("Follow.Self", "A user cannot follow themselves."));
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

            var alreadyFollowing = await _friendshipRepository.ExistsFollowingAsync(request.FollowerId, request.FolloweeId, cancellationToken);
            if (alreadyFollowing)
            {
                return Result.Success();
            }

            var following = new Following(request.FollowerId, request.FolloweeId);
            await _friendshipRepository.AddFollowingAsync(following);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
