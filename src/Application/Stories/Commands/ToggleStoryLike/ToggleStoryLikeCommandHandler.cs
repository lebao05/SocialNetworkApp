using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Shared;

namespace Application.Stories.Commands.ToggleStoryLike;

internal sealed class ToggleStoryLikeCommandHandler : ICommandHandler<ToggleStoryLikeCommand, ToggleStoryLikeResponse>
{
    private readonly IStoryRepository _storyRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ToggleStoryLikeCommandHandler(
        IStoryRepository storyRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork)
    {
        _storyRepository = storyRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<ToggleStoryLikeResponse>> Handle(ToggleStoryLikeCommand request, CancellationToken cancellationToken)
    {
        var userExists = await _userRepository.ExistsAsync(request.UserId, cancellationToken);
        if (!userExists)
        {
            return Result.Failure<ToggleStoryLikeResponse>(new Error(
                "User.NotFound",
                $"The user with Id {request.UserId} was not found."));
        }

        var story = await _storyRepository.GetByIdAsync(request.StoryId, cancellationToken);
        if (story is null)
        {
            return Result.Failure<ToggleStoryLikeResponse>(new Error(
                "Story.NotFound",
                $"The story with Id {request.StoryId} was not found."));
        }

        if (story.IsExpired)
        {
            return Result.Failure<ToggleStoryLikeResponse>(new Error(
                "Story.Expired",
                "This story has expired."));
        }

        var existingReaction = await _storyRepository.GetReactionAsync(request.StoryId, request.UserId, cancellationToken);

        if (existingReaction is not null)
        {
            _storyRepository.RemoveReaction(existingReaction);
        }
        else
        {
            var reaction = new StoryReaction(
                id: 0,
                userId: request.UserId,
                storyId: request.StoryId);

            _storyRepository.AddReaction(reaction);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var updatedStory = await _storyRepository.GetByIdAsync(request.StoryId, cancellationToken);
        var likeCount = updatedStory?.Reactions.Count ?? 0;

        return Result.Success(new ToggleStoryLikeResponse(
            IsLiked: existingReaction is null,
            LikeCount: likeCount));
    }
}
