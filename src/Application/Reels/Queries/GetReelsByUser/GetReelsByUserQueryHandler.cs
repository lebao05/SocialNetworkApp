using System.Linq;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Reels;
using Application.Shared;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;

namespace Application.Reels.Queries.GetReelsByUser
{
    internal sealed class GetReelsByUserQueryHandler : IQueryHandler<GetReelsByUserQuery, PagedList<ReelDto>>
    {
        private readonly IReelRepository _reelRepository;

        public GetReelsByUserQueryHandler(IReelRepository reelRepository)
        {
            _reelRepository = reelRepository;
        }

        public async Task<Result<PagedList<ReelDto>>> Handle(GetReelsByUserQuery request, CancellationToken cancellationToken)
        {
            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 100);

            var reels = await _reelRepository.GetByAuthorIdAsync(request.AuthorId, cancellationToken);

            var filtered = reels
                .Where(reel => reel.DeletedAt is null)
                .OrderByDescending(reel => reel.CreatedAt)
                .ToList();

            var totalCount = filtered.Count;
            var pagedItems = filtered
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(reel => Map(reel, request.CurrentUserId))
                .ToList();

            return Result.Success(new PagedList<ReelDto>(pagedItems, page, pageSize, totalCount));
        }

        private static ReelDto Map(Reel reel, Guid? currentUserId)
        {
            var userReaction = currentUserId.HasValue
                ? reel.Reactions.FirstOrDefault(reaction => reaction.UserId == currentUserId.Value)?.ReactionType
                : null;

            var likeCount = reel.Reactions.Count(reaction => reaction.ReactionType == ReactionType.Like || reaction.ReactionType == ReactionType.Love);
            var viewCount = EstimateViewCount(reel, likeCount);
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
                viewCount,
                userReaction,
                reel.CreatedAt,
                reel.UpdatedAt,
                currentUserId.HasValue && reel.AuthorId == currentUserId.Value,
                userReaction.HasValue);
        }

        private static int EstimateViewCount(Reel reel, int likeCount)
        {
            var reactionCount = reel.Reactions.Count;
            var commentCount = reel.Comments.Count;
            var baseline = reactionCount * 8 + commentCount * 5 + likeCount * 12;
            var minimum = Math.Max(1, likeCount + commentCount + reactionCount) * 10;
            return Math.Max(baseline, minimum);
        }
    }
}
