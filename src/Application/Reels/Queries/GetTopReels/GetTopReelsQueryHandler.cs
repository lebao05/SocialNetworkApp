using System.Linq;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Reels;
using Application.Reels.Queries.GetTopReels;
using Application.Shared;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;

namespace Application.Reels.Queries.GetTopReels;

internal sealed class GetTopReelsQueryHandler : IQueryHandler<GetTopReelsQuery, PagedList<ReelDto>>
{
    private readonly IReelRepository _reelRepository;

    public GetTopReelsQueryHandler(IReelRepository reelRepository)
    {
        _reelRepository = reelRepository;
    }

    public async Task<Result<PagedList<ReelDto>>> Handle(GetTopReelsQuery request, CancellationToken cancellationToken)
    {
        var since = DateTime.UtcNow - TimeSpan.FromDays(100);
        var pageSize = Math.Clamp(request.PageSize, 1, 50);

        var reels = await _reelRepository.GetTopReelsAsync(request.UserId, since, pageSize, cancellationToken);

        var items = reels.Select(r => Map(r)).ToList();
        var totalCount = items.Count;

        return Result.Success(new PagedList<ReelDto>(items, 1, pageSize, totalCount));
    }

    private static ReelDto Map(Reel reel)
    {
        var likeCount = reel.Reactions.Count;
        var authorName = reel.Author is null
            ? "User"
            : $"{reel.Author.FirstName} {reel.Author.LastName}".Trim();

        return new ReelDto(
            reel.Id,
            reel.AuthorId,
            string.IsNullOrWhiteSpace(authorName) ? "User" : authorName,
            reel.Author?.AvatarUrl,
            reel.VideoUrl,
            reel.ThumbnailUrl,
            reel.Caption,
            reel.AudioTitle,
            reel.Duration,
            reel.Visibility,
            likeCount,
            reel.Comments.Count,
            reel.ViewCount,
            reel.CreatedAt,
            reel.UpdatedAt,
            IsOwnReel: false,
            IsLikedByCurrentUser: false);
    }
}
