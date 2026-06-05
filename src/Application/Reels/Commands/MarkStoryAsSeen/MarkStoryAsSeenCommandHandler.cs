using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Shared;

namespace Application.Reels.Commands.MarkStoryAsSeen
{
    internal sealed class MarkStoryAsSeenCommandHandler : ICommandHandler<MarkStoryAsSeenCommand>
    {
        private readonly IReelRepository _reelRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public MarkStoryAsSeenCommandHandler(
            IReelRepository reelRepository,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork)
        {
            _reelRepository = reelRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(MarkStoryAsSeenCommand request, CancellationToken cancellationToken)
        {
            var userExists = await _userRepository.ExistsAsync(request.UserId, cancellationToken);
            if (!userExists)
            {
                return Result.Failure(new Error("User.NotFound", $"The user with Id {request.UserId} was not found."));
            }

            var story = await _reelRepository.GetByIdAsync(request.StoryId, cancellationToken);
            if (story is null)
            {
                return Result.Failure(new Error("Story.NotFound", $"The story with Id {request.StoryId} was not found."));
            }

            var existingSeen = await _reelRepository.GetStorySeenAsync(request.StoryId, request.UserId, cancellationToken);
            if (existingSeen is not null)
            {
                existingSeen.MarkSeen();
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                return Result.Success();
            }

            var storySeen = new StorySeen(request.StoryId, request.UserId);
            _reelRepository.AddStorySeen(storySeen);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
