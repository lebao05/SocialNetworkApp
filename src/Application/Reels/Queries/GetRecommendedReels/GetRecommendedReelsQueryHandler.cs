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
            var pageSize = Math.Clamp(request.PageSize, 1, 100);

            // Get random reels from the database (already ordered randomly)
            var reels = (await _reelRepository.GetRecentReelsAsync(request.UserId, DateTime.UtcNow - TimeSpan.FromDays(100), cancellationToken)).ToList();

            // Take the requested page size
            var items = reels.Take(pageSize).Select(r => Map(r, request.UserId)).ToList();

            return Result.Success(new PagedList<ReelDto>(items, 1, pageSize, items.Count));
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
                IsOwnReel: reel.AuthorId == currentUserId,
                IsLikedByCurrentUser: hasUserReaction);
        }
    }
}
