using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Posts;
using Application.Groups;
using Application.Shared;
using Domain.Entities;
using Domain.Shared;

namespace Application.Posts.Queries.GetPostMediasByGroup
{
    internal sealed class GetPostMediasByGroupQueryHandler : IQueryHandler<GetPostMediasByGroupQuery, PagedList<PostMediaItemDto>>
    {
        private readonly IPostRepository _postRepository;
        private readonly IGroupRepository _groupRepository;

        public GetPostMediasByGroupQueryHandler(
            IPostRepository postRepository,
            IGroupRepository groupRepository)
        {
            _postRepository = postRepository;
            _groupRepository = groupRepository;
        }

        public async Task<Result<PagedList<PostMediaItemDto>>> Handle(GetPostMediasByGroupQuery request, CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdAsync(request.GroupId, cancellationToken);

            var accessError = await GroupGuard.EnsureCanViewContentAsync(
                group,
                request.UserId,
                (uid, gid, ct) => _groupRepository.IsUserInGroupAsync(uid, gid, ct),
                cancellationToken);
            if (accessError is not null)
            {
                return Result.Failure<PagedList<PostMediaItemDto>>(accessError);
            }

            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 100);
            var mediaType = NormalizeMediaType(request.Type);
            if (mediaType is null)
            {
                return Result.Failure<PagedList<PostMediaItemDto>>(new Error(
                    "PostMedia.InvalidType",
                    "Media type is required. Valid values are: image, video."));
            }

            var medias = await _postRepository.GetMediasByGroupIdPagedAsync(request.GroupId, page, pageSize, mediaType, cancellationToken);

            return Result.Success(new PagedList<PostMediaItemDto>(
                medias.Items.Select(Map).ToList(),
                medias.PageNumber,
                medias.PageSize,
                medias.TotalCount));
        }

        private static PostMediaItemDto Map(PostMedia media)
        {
            return new PostMediaItemDto(
                media.Id,
                media.PostId,
                media.MediaType,
                media.MediaUrl,
                media.ThumbnailUrl,
                media.Metadata,
                media.UploadedAt);
        }

        private static string? NormalizeMediaType(string type)
        {
            if (string.IsNullOrWhiteSpace(type))
                return null;

            return type.Trim().ToLowerInvariant() switch
            {
                "image" => "Image",
                "video" => "Video",
                _ => null
            };
        }
    }
}
