using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Shared;

namespace Application.Stories.Commands.MarkStoryAsSeen;

internal sealed class MarkStoryAsSeenCommandHandler : ICommandHandler<MarkStoryAsSeenCommand, MarkStoryAsSeenResponse>
{
    private readonly IStoryRepository _storyRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public MarkStoryAsSeenCommandHandler(
        IStoryRepository storyRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork)
    {
        _storyRepository = storyRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<MarkStoryAsSeenResponse>> Handle(MarkStoryAsSeenCommand request, CancellationToken cancellationToken)
    {
        var userExists = await _userRepository.ExistsAsync(request.UserId, cancellationToken);
        if (!userExists)
        {
            return Result.Failure<MarkStoryAsSeenResponse>(new Error(
                "User.NotFound",
                $"The user with Id {request.UserId} was not found."));
        }

        var story = await _storyRepository.GetByIdAsync(request.StoryId, cancellationToken);
        if (story is null)
        {
            return Result.Failure<MarkStoryAsSeenResponse>(new Error(
                "Story.NotFound",
                $"The story with Id {request.StoryId} was not found."));
        }

        if (story.IsExpired)
        {
            return Result.Failure<MarkStoryAsSeenResponse>(new Error(
                "Story.Expired",
                "This story has expired."));
        }

        var existingSeen = await _storyRepository.GetStorySeenAsync(request.StoryId, request.UserId, cancellationToken);
        if (existingSeen is null)
        {
            var storySeen = new StorySeen(
                storyId: request.StoryId,
                userId: request.UserId);

            _storyRepository.AddStorySeen(storySeen);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        return Result.Success(new MarkStoryAsSeenResponse());
    }
}
