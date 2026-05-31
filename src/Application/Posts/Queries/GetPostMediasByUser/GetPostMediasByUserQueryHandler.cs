using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Posts;
using Application.Shared;
using Domain.Entities;
using Domain.Shared;

namespace Application.Posts.Queries.GetPostMediasByUser
{
    internal sealed class GetPostMediasByUserQueryHandler : IQueryHandler<GetPostMediasByUserQuery, PagedList<PostMediaItemDto>>
    {
        private readonly IPostRepository _postRepository;

        public GetPostMediasByUserQueryHandler(IPostRepository postRepository)
        {
            _postRepository = postRepository;
        }

        public async Task<Result<PagedList<PostMediaItemDto>>> Handle(GetPostMediasByUserQuery request, CancellationToken cancellationToken)
        {
            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 100);
            var mediaType = NormalizeMediaType(request.Type);
            if (mediaType is null)
            {
                return Result.Failure<PagedList<PostMediaItemDto>>(new Error(
                    "PostMedia.InvalidType",
                    "Media type is required. Valid values are: image, video."));
            }

            var medias = await _postRepository.GetMediasByAuthorIdPagedAsync(request.UserId, page, pageSize, mediaType, cancellationToken);

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
