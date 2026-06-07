using System.Linq;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Reels;
using Application.Shared;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;

namespace Application.Reels.Queries.GetRecommendedReels
{
    internal sealed class GetRecommendedReelsQueryHandler : IQueryHandler<GetRecommendedReelsQuery, PagedList<ReelDto>>
    {
        private readonly IReelRepository _reelRepository;

        public GetRecommendedReelsQueryHandler(IReelRepository reelRepository)
        {
            _reelRepository = reelRepository;
        }

        public async Task<Result<PagedList<ReelDto>>> Handle(GetRecommendedReelsQuery request, CancellationToken cancellationToken)
        {
            var since = DateTime.UtcNow - TimeSpan.FromDays(3);

            var recentReels = (await _reelRepository.GetRecentReelsAsync(since, cancellationToken))
                .Where(r => r.DeletedAt is null && r.Visibility != ReelVisibility.Private)
                .OrderByDescending(r => r.CreatedAt)
                .ToList();

            var pageSize = Math.Clamp(request.PageSize, 1, 100);
            var taken = recentReels.Take(pageSize).ToList();

            var items = taken.Select(r => Map(r, request.UserId)).ToList();
            var totalCount = recentReels.Count;

            return Result.Success(new PagedList<ReelDto>(items, 1, pageSize, totalCount));
        }

        private static ReelDto Map(Reel reel, Guid currentUserId)
        {
            var hasUserReaction = reel.Reactions.Any(r => r.UserId == currentUserId);
            var likeCount = reel.Reactions.Count;
            var authorName = reel.Author is null
                ? "Người dùng"
                : $"{reel.Author.FirstName} {reel.Author.LastName}".Trim();

            return new ReelDto(
                reel.Id,
                reel.AuthorId,
                string.IsNullOrWhiteSpace(authorName) ? "Người dùng" : authorName,
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
                IsLikedByCurrentUser: hasUserReaction);
        }
    }
}
