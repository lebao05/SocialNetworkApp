using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;

namespace Application.Posts.Commands.CreatePost
{
    internal sealed class CreatePostCommandHandler : ICommandHandler<CreatePostCommand, long>
    {
        private readonly IPostRepository _postRepository;
        private readonly IUserRepository _userRepository;
        private readonly IGroupRepository _groupRepository;
        private readonly IUploadService _uploadService;
        private readonly IUnitOfWork _unitOfWork;

        public CreatePostCommandHandler(
            IPostRepository postRepository,
            IUserRepository userRepository,
            IGroupRepository groupRepository,
            IUploadService uploadService,
            IUnitOfWork unitOfWork)
        {
            _postRepository = postRepository;
            _userRepository = userRepository;
            _groupRepository = groupRepository;
            _uploadService = uploadService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<long>> Handle(CreatePostCommand request, CancellationToken cancellationToken)
        {
            var authorExists = await _userRepository.ExistsAsync(request.AuthorId, cancellationToken);
            if (!authorExists)
            {
                return Result.Failure<long>(new Error(
                    "User.NotFound",
                    $"The user with Id {request.AuthorId} was not found."));
            }

            if (request.SharePostId.HasValue)
            {
                var sharedPost = await _postRepository.GetByIdAsync(request.SharePostId.Value, cancellationToken);
                if (sharedPost is null)
                {
                    return Result.Failure<long>(new Error(
                        "Post.SharePostNotFound",
                        $"The shared post with Id {request.SharePostId.Value} was not found."));
                }
            }

            Group? group = null;
            if (request.GroupId.HasValue)
            {
                group = await _groupRepository.GetByIdWithMembersAsync(request.GroupId.Value, cancellationToken);
                if (group is null)
                {
                    return Result.Failure<long>(new Error(
                        "Group.NotFound",
                        $"Group with id {request.GroupId.Value} was not found."));
                }

                var authorIsMember = group.OwnerUserId == request.AuthorId
                    || group.Members.Any(m => m.UserId == request.AuthorId);

                if (!authorIsMember)
                {
                    return Result.Failure<long>(new Error(
                        "Group.NotMember",
                        "You must be a member of the group to create a post."));
                }
            }

            var attachments = request.Attachments ?? Array.Empty<PostAttachment>();
            var hasMediaAttachments = attachments.Any(IsImageOrVideo);
            var hasFileAttachments = attachments.Any(IsFile);

            if (string.IsNullOrWhiteSpace(request.Content)
                && attachments.Count == 0
                && !request.SharePostId.HasValue)
            {
                return Result.Failure<long>(new Error(
                    "Post.Empty",
                    "A post must include content, an attachment, or a shared post."));
            }

            if (hasMediaAttachments && hasFileAttachments)
            {
                return Result.Failure<long>(new Error(
                    "Post.AttachmentConflict",
                    "Files can not be uploaded together with images or videos."));
            }

            foreach (var taggedUserId in request.TaggedUserIds ?? Array.Empty<Guid>())
            {
                var taggedUserExists = await _userRepository.ExistsAsync(taggedUserId, cancellationToken);
                if (!taggedUserExists)
                {
                    return Result.Failure<long>(new Error(
                        "Post.TaggedUserNotFound",
                        $"The tagged user with Id {taggedUserId} was not found."));
                }
            }

            // Validate that all tagged users belong to the group if post is created in a group
            if (request.GroupId.HasValue && (request.TaggedUserIds?.Count > 0))
            {
                foreach (var taggedUserId in request.TaggedUserIds)
                {
                    var isUserInGroup = await _groupRepository.IsUserInGroupAsync(taggedUserId, request.GroupId.Value, cancellationToken);
                    if (!isUserInGroup)
                    {
                        return Result.Failure<long>(new Error(
                            "Post.TaggedUserNotInGroup",
                            $"The tagged user with Id {taggedUserId} is not a member of the group."));
                    }
                }
            }

            var visibility = request.GroupId.HasValue
                ? PostVisibility.Group
                : request.Visibility;

            var post = new Post(
                id: 0,
                authorId: request.AuthorId,
                groupId: request.GroupId,
                content: request.Content,
                visibility: visibility,
                sharePostId: request.SharePostId,
                locationTag: request.LocationTag,
                feelingActivity: request.FeelingActivity);

            var uploadedUrls = new List<string>();
            try
            {
                foreach (var attachment in attachments)
                {
                    var mediaType = GetMediaType(attachment);
                    var mediaUrl = await UploadAttachmentAsync(attachment, mediaType);
                    uploadedUrls.Add(mediaUrl);

                    post.AddMedia(new PostMedia(
                        id: 0,
                        postId: 0,
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
                return Result.Failure<long>(new Error("Post.UploadFailed", ex.Message));
            }

            foreach (var taggedUserId in request.TaggedUserIds ?? Array.Empty<Guid>())
            {
                post.AddTag(new PostTag(
                    id: 0,
                    postId: 0,
                    tagName: taggedUserId.ToString()));
            }

            var authorCanBypassGroupPostApproval = group?.OwnerUserId == request.AuthorId
                || group?.Members.Any(m =>
                    m.UserId == request.AuthorId
                    && (m.Role == GroupMemberRole.Admin || m.Role == GroupMemberRole.Moderator)) == true;

            if (group?.IsPostApprovalRequired == true && !authorCanBypassGroupPostApproval)
            {
                post.SetPendingApproval();
            }

            _postRepository.Add(post);

            try
            {
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }
            catch (Exception ex)
            {
                foreach (var url in uploadedUrls)
                {
                    await _uploadService.DeleteFileAsync(url);
                }
                return Result.Failure<long>(new Error("Post.SaveFailed", ex.Message));
            }

            return Result.Success(post.Id);
        }

        private static bool IsImageOrVideo(PostAttachment attachment)
        {
            return attachment.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase)
                || attachment.ContentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase);
        }

        private static bool IsFile(PostAttachment attachment)
        {
            return !IsImageOrVideo(attachment);
        }

        private static string GetMediaType(PostAttachment attachment)
        {
            if (attachment.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
            {
                return "Image";
            }

            if (attachment.ContentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase))
            {
                return "Video";
            }

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
