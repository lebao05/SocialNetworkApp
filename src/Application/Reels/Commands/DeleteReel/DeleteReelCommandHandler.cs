using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Reels.Commands.DeleteReel
{
    internal sealed class DeleteReelCommandHandler : ICommandHandler<DeleteReelCommand>
    {
        private readonly IReelRepository _reelRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteReelCommandHandler(
            IReelRepository reelRepository,
            IUnitOfWork unitOfWork)
        {
            _reelRepository = reelRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(DeleteReelCommand request, CancellationToken cancellationToken)
        {
            var reel = await _reelRepository.GetByIdAsync(request.ReelId, cancellationToken);
            if (reel is null)
            {
                return Result.Failure(new Error(
                    "Reel.NotFound",
                    $"The reel with Id {request.ReelId} was not found."));
            }

            if (reel.AuthorId != request.UserId)
            {
                return Result.Failure(new Error(
                    "Reel.Forbidden",
                    "You are not authorized to delete this reel."));
            }

            _reelRepository.Delete(reel);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
