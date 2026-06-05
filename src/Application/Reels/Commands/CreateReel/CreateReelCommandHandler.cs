using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Shared;

namespace Application.Reels.Commands.CreateReel
{
    internal sealed class CreateReelCommandHandler : ICommandHandler<CreateReelCommand, long>
    {
        private readonly IReelRepository _reelRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUploadService _uploadService;
        private readonly IUnitOfWork _unitOfWork;

        public CreateReelCommandHandler(
            IReelRepository reelRepository,
            IUserRepository userRepository,
            IUploadService uploadService,
            IUnitOfWork unitOfWork)
        {
            _reelRepository = reelRepository;
            _userRepository = userRepository;
            _uploadService = uploadService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<long>> Handle(CreateReelCommand request, CancellationToken cancellationToken)
        {
            var authorExists = await _userRepository.ExistsAsync(request.AuthorId, cancellationToken);
            if (!authorExists)
            {
                return Result.Failure<long>(new Error(
                    "User.NotFound",
                    $"The user with Id {request.AuthorId} was not found."));
            }

            if (!request.Video.ContentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase))
            {
                return Result.Failure<long>(new Error(
                    "Reel.VideoRequired",
                    "A reel requires a valid video file."));
            }

            if (request.Thumbnail is not null && !request.Thumbnail.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
            {
                return Result.Failure<long>(new Error(
                    "Reel.ThumbnailInvalid",
                    "Thumbnail must be an image file."));
            }

            UploadedVideoResult? uploadedVideo = null;
            string? thumbnailUrl = null;

            try
            {
                uploadedVideo = await _uploadService.UploadVideoWithMetadataAsync(request.Video.Stream, request.Video.FileName);

                thumbnailUrl = request.Thumbnail is not null
                    ? await _uploadService.UploadImageAsync(request.Thumbnail.Stream, request.Thumbnail.FileName)
                    : uploadedVideo.ThumbnailUrl;
            }
            catch (Exception ex)
            {
                if (uploadedVideo is not null)
                {
                    await _uploadService.DeleteFileAsync(uploadedVideo.VideoUrl);
                    if (!string.IsNullOrWhiteSpace(uploadedVideo.ThumbnailUrl) && uploadedVideo.ThumbnailUrl != thumbnailUrl)
                    {
                        await _uploadService.DeleteFileAsync(uploadedVideo.ThumbnailUrl);
                    }
                }

                if (!string.IsNullOrWhiteSpace(thumbnailUrl))
                {
                    await _uploadService.DeleteFileAsync(thumbnailUrl);
                }

                return Result.Failure<long>(new Error("Reel.UploadFailed", ex.Message));
            }

            var reel = new Reel(
                id: 0,
                authorId: request.AuthorId,
                videoUrl: uploadedVideo.VideoUrl,
                thumbnailUrl: thumbnailUrl,
                caption: request.Caption,
                audioTitle: request.AudioTitle,
                duration: uploadedVideo.Duration,
                visibility: request.Visibility);

            _reelRepository.Add(reel);

            try
            {
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }
            catch (Exception ex)
            {
                await _uploadService.DeleteFileAsync(uploadedVideo.VideoUrl);
                if (!string.IsNullOrWhiteSpace(thumbnailUrl))
                {
                    await _uploadService.DeleteFileAsync(thumbnailUrl);
                }

                return Result.Failure<long>(new Error("Reel.SaveFailed", ex.Message));
            }

            return Result.Success(reel.Id);
        }
    }
}
