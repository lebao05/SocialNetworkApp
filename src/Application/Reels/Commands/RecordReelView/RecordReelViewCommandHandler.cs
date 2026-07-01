using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Reels.Commands.RecordReelView;

internal sealed class RecordReelViewCommandHandler : ICommandHandler<RecordReelViewCommand>
{
    private readonly IReelRepository _reelRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public RecordReelViewCommandHandler(
        IReelRepository reelRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork)
    {
        _reelRepository = reelRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(RecordReelViewCommand request, CancellationToken cancellationToken)
    {
        var userExists = await _userRepository.ExistsAsync(request.UserId, cancellationToken);
        if (!userExists)
        {
            return Result.Failure(new Error(
                "User.NotFound",
                $"The user with Id {request.UserId} was not found."));
        }

        var reel = await _reelRepository.GetByIdAsync(request.ReelId, cancellationToken);
        if (reel is null)
        {
            return Result.Failure(new Error(
                "Reel.NotFound",
                $"The reel with Id {request.ReelId} was not found."));
        }

        reel.RecordView();
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
