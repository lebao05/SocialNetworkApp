using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;

namespace Application.Stories.Commands.CreateStory;

internal sealed class CreateStoryCommandHandler : ICommandHandler<CreateStoryCommand, long>
{
    private readonly IStoryRepository _storyRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateStoryCommandHandler(
        IStoryRepository storyRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork)
    {
        _storyRepository = storyRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<long>> Handle(CreateStoryCommand request, CancellationToken cancellationToken)
    {
        var userExists = await _userRepository.ExistsAsync(request.UserId, cancellationToken);
        if (!userExists)
        {
            return Result.Failure<long>(new Error(
                "User.NotFound",
                $"The user with Id {request.UserId} was not found."));
        }

        var story = new Story(
            id: 0,
            userId: request.UserId,
            mediaUrl: request.MediaUrl,
            mediaType: request.MediaType,
            backgroundGradient: request.BackgroundGradient,
            textContent: request.TextContent,
            textColor: request.TextColor,
            textStyle: request.TextStyle,
            textPositionX: request.TextPositionX,
            textPositionY: request.TextPositionY,
            fontFamily: request.FontFamily);

        _storyRepository.Add(story);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(story.Id);
    }
}
