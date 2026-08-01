using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Posts.Commands.CreatePost;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;

namespace Application.Posts.Commands.UpdatePost
{
    internal sealed class UpdatePostCommandHandler : ICommandHandler<UpdatePostCommand>
    {
        private readonly IPostRepository _postRepository;
        private readonly IUploadService _uploadService;
        private readonly IUnitOfWork _unitOfWork;

        public UpdatePostCommandHandler(
            IPostRepository postRepository,
            IUploadService uploadService,
            IUnitOfWork unitOfWork)
        {
            _postRepository = postRepository;
            _uploadService = uploadService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(UpdatePostCommand request, CancellationToken cancellationToken)
        {
            var post = await _postRepository.GetByIdAsync(request.PostId, cancellationToken);
            if (post is null)
            {
                return Result.Failure(new Error(
                    "Post.NotFound",
                    $"The post with Id {request.PostId} was not found."));
            }

            if (post.AuthorId != request.UserId)
            {
                return Result.Failure(new Error(
                    "Post.Forbidden",
                    "You do not have permission to update this post."));
            }

            if (request.Visibility.HasValue && !(post.Visibility == PostVisibility.Group && request.Visibility.Value == PostVisibility.Group))
            {
                if (post.Visibility == PostVisibility.Group)
                {
                    return Result.Failure(new Error(
                        "Post.CannotChangeVisibility",
                        "Cannot change visibility of a group post."));
                }

                if (request.Visibility.Value == PostVisibility.Group)
                {
                    return Result.Failure(new Error(
                        "Post.CannotSetGroupVisibility",
                        "Cannot set visibility to Group via this operation."));
                }
            }

            var retainIds = request.RetainMediaIds?.ToHashSet() ?? new HashSet<long>();
            var existingMedia = post.Media.ToList();
            var toRemove = existingMedia.Where(m => !retainIds.Contains(m.Id)).ToList();

            foreach (var media in toRemove)
            {
                await _uploadService.DeleteFileAsync(media.MediaUrl);
                _postRepository.RemoveMedia(media);
            }

            var uploadedUrls = new List<string>();
            Console.WriteLine(request.NewAttachments?.Count() ?? 0);
            try
            {
                foreach (var attachment in request.NewAttachments ?? Array.Empty<PostAttachment>())
                {
                    var mediaType = GetMediaType(attachment);
                    var mediaUrl = await UploadAttachmentAsync(attachment, mediaType);
                    uploadedUrls.Add(mediaUrl);

                    _postRepository.AddMedia(new PostMedia(
                        id: 0,
                        postId: post.Id,
                        mediaType: mediaType,
                        mediaUrl: mediaUrl,
                        thumbnailUrl: null,
                        metadata: null));
                }
            }
            catch (Exception ex)
            {
                foreach (var url in uploadedUrls)
                {
                    await _uploadService.DeleteFileAsync(url);
                }
                return Result.Failure(new Error("Post.UploadFailed", ex.Message));
            }

            if (string.IsNullOrWhiteSpace(request.Content)
                && post.Media.Count - toRemove.Count == 0
                && !post.SharePostId.HasValue)
            {
                foreach (var url in uploadedUrls)
                {
                    await _uploadService.DeleteFileAsync(url);
                }
                return Result.Failure(new Error(
                    "Post.Empty",
                    "A post must include content, an attachment, or a shared post."));
            }

            post.Update(
                request.Content,
                request.Visibility ?? post.Visibility,
                request.LocationTag,
                request.FeelingActivity);

            _postRepository.Update(post);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }

        private static bool IsImageOrVideo(PostAttachment attachment)
        {
            return attachment.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase)
                || attachment.ContentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase);
        }

        private static string GetMediaType(PostAttachment attachment)
        {
            if (attachment.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
                return "Image";
            if (attachment.ContentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase))
                return "Video";
            return "File";
        }

        private async Task<string> UploadAttachmentAsync(PostAttachment attachment, string mediaType)
        {
            return mediaType switch
            {
                "Image" => await _uploadService.UploadImageAsync(attachment.Stream, attachment.FileName),
                "Video" => await _uploadService.UploadVideoAsync(attachment.Stream, attachment.FileName),
                _ => await _uploadService.UploadFileAsync(attachment.Stream, attachment.FileName)
            };
        }
    }
}
