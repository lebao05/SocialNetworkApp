using System.Linq;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Groups;
using Application.DTOs.Posts;
using Application.Shared;
using Domain.Entities;
using Domain.Shared;

namespace Application.Posts.Queries.GetPostsByGroup
{
    internal sealed class GetPostsByGroupQueryHandler : IQueryHandler<GetPostsByGroupQuery, PagedList<PostDto>>
    {
        private readonly IPostRepository _postRepository;

        public GetPostsByGroupQueryHandler(IPostRepository postRepository)
        {
            _postRepository = postRepository;
        }

        public async Task<Result<PagedList<PostDto>>> Handle(GetPostsByGroupQuery request, CancellationToken cancellationToken)
        {
            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 100);
            var posts = await _postRepository.GetByGroupIdPagedAsync(request.GroupId, page, pageSize, cancellationToken);

            var items = posts.Items.Select(Map).ToList();

            return Result.Success(new PagedList<PostDto>(
                items,
                posts.PageNumber,
                posts.PageSize,
                posts.TotalCount));
        }

        private static PostDto Map(Post post)
        {
            return new PostDto(
                post.Id,
                post.AuthorId,
                post.Author != null ? $"{post.Author.FirstName} {post.Author.LastName}" : "Người dùng",
                post.Author?.AvatarUrl,
                post.GroupId,
                post.Content,
                post.Visibility,
                post.SharePostId,
                post.LocationTag,
                post.FeelingActivity,
                post.CreatedAt,
                post.UpdatedAt,
                post.DeletedAt,
                post.Media.Select(m => new PostMediaDto(
                    m.Id,
                    m.MediaType,
                    m.MediaUrl,
                    m.ThumbnailUrl,
                    m.Metadata,
                    m.UploadedAt
                )).ToList(),
                MapGroup(post.Group),
                post.SharePost is null ? null : MapSharedPost(post.SharePost));
        }

        private static PostDto MapSharedPost(Post post)
        {
            return new PostDto(
                post.Id,
                post.AuthorId,
                post.Author != null ? $"{post.Author.FirstName} {post.Author.LastName}" : "Người dùng",
                post.Author?.AvatarUrl,
                post.GroupId,
                post.Content,
                post.Visibility,
                post.SharePostId,
                post.LocationTag,
                post.FeelingActivity,
                post.CreatedAt,
                post.UpdatedAt,
                post.DeletedAt,
                post.Media.Select(m => new PostMediaDto(
                    m.Id,
                    m.MediaType,
                    m.MediaUrl,
                    m.ThumbnailUrl,
                    m.Metadata,
                    m.UploadedAt
                )).ToList(),
                MapGroup(post.Group),
                null);
        }

        private static GroupDto? MapGroup(Group? group)
        {
            return group is null
                ? null
                : new GroupDto(
                    group.Id,
                    group.OwnerUserId,
                    group.Name,
                    group.Description,
                    group.PrivacyType,
                    group.CoverPhotoUrl);
        }
    }
}
