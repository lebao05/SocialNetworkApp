using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Stories.Commands.DeleteStory;

internal sealed class DeleteStoryCommandHandler : ICommandHandler<DeleteStoryCommand>
{
    private readonly IStoryRepository _storyRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteStoryCommandHandler(
        IStoryRepository storyRepository,
        IUnitOfWork unitOfWork)
    {
        _storyRepository = storyRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(DeleteStoryCommand request, CancellationToken cancellationToken)
    {
        var story = await _storyRepository.GetByIdAsync(request.StoryId, cancellationToken);
        if (story is null)
        {
            return Result.Failure(new Error(
                "Story.NotFound",
                $"The story with Id {request.StoryId} was not found."));
        }

        if (story.UserId != request.UserId)
        {
            return Result.Failure(new Error(
                "Story.Forbidden",
                "You are not authorized to delete this story."));
        }

        _storyRepository.Delete(story);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
