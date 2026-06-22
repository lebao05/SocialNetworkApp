using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;
using System.IO;

namespace Application.Stories.Commands.UploadStoryMedia;

internal sealed class UploadStoryMediaCommandHandler : ICommandHandler<UploadStoryMediaCommand, string>
{
    private readonly IUserRepository _userRepository;
    private readonly IUploadService _uploadService;

    public UploadStoryMediaCommandHandler(
        IUserRepository userRepository,
        IUploadService uploadService)
    {
        _userRepository = userRepository;
        _uploadService = uploadService;
    }

    public async Task<Result<string>> Handle(UploadStoryMediaCommand request, CancellationToken cancellationToken)
    {
        var userExists = await _userRepository.ExistsAsync(request.UserId, cancellationToken);
        if (!userExists)
        {
            return Result.Failure<string>(new Error(
                "User.NotFound",
                $"The user with Id {request.UserId} was not found."));
        }

        try
        {
            string mediaUrl;
            if (request.ContentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase))
            {
                mediaUrl = await _uploadService.UploadVideoAsync(request.FileStream, request.FileName);
            }
            else
            {
                mediaUrl = await _uploadService.UploadImageAsync(request.FileStream, request.FileName);
            }

            return Result.Success(mediaUrl);
        }
        catch (Exception ex)
        {
            return Result.Failure<string>(new Error("StoryMedia.UploadFailed", ex.Message));
        }
    }
}
