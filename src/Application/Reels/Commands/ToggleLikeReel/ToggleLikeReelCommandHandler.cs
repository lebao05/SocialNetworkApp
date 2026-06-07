using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Shared;

namespace Application.Reels.Commands.ToggleLikeReel
{
    internal sealed class ToggleLikeReelCommandHandler : ICommandHandler<ToggleLikeReelCommand, ToggleLikeReelResponse>
    {
        private readonly IReelRepository _reelRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ToggleLikeReelCommandHandler(
            IReelRepository reelRepository,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork)
        {
            _reelRepository = reelRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<ToggleLikeReelResponse>> Handle(ToggleLikeReelCommand request, CancellationToken cancellationToken)
        {
            var userExists = await _userRepository.ExistsAsync(request.UserId, cancellationToken);
            if (!userExists)
            {
                return Result.Failure<ToggleLikeReelResponse>(new Error(
                    "User.NotFound",
                    $"The user with Id {request.UserId} was not found."));
            }

            var reel = await _reelRepository.GetByIdAsync(request.ReelId, cancellationToken);
            if (reel is null)
            {
                return Result.Failure<ToggleLikeReelResponse>(new Error(
                    "Reel.NotFound",
                    $"The reel with Id {request.ReelId} was not found."));
            }

            var existingReaction = await _reelRepository.GetReactionAsync(request.ReelId, request.UserId, cancellationToken);

            if (existingReaction is not null)
            {
                _reelRepository.RemoveReaction(existingReaction);
            }
            else
            {
                var reaction = new ReelReaction(
                    id: 0,
                    userId: request.UserId,
                    reelId: request.ReelId);

                _reelRepository.AddReaction(reaction);
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var updatedReel = await _reelRepository.GetByIdAsync(request.ReelId, cancellationToken);
            var likeCount = updatedReel?.Reactions.Count ?? 0;

            return Result.Success(new ToggleLikeReelResponse(
                IsLiked: existingReaction is null,
                LikeCount: likeCount));
        }
    }
}
