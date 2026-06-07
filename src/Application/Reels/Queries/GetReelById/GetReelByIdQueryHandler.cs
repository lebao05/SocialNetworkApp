using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Reels;
using Domain.Shared;

namespace Application.Reels.Queries.GetReelById
{
    internal sealed class GetReelByIdQueryHandler : IQueryHandler<GetReelByIdQuery, ReelDto>
    {
        private readonly IReelRepository _reelRepository;

        public GetReelByIdQueryHandler(IReelRepository reelRepository)
        {
            _reelRepository = reelRepository;
        }

        public async Task<Result<ReelDto>> Handle(GetReelByIdQuery request, CancellationToken cancellationToken)
        {
            var reel = await _reelRepository.GetByIdAsync(request.ReelId, cancellationToken);
            if (reel is null)
            {
                return Result.Failure<ReelDto>(new Error(
                    "Reel.NotFound",
                    $"The reel with Id {request.ReelId} was not found."));
            }

            var hasUserReaction = request.CurrentUserId.HasValue
                && reel.Reactions.Any(r => r.UserId == request.CurrentUserId.Value);

            var likeCount = reel.Reactions.Count;

            var authorName = reel.Author is null
                ? "Người dùng"
                : $"{reel.Author.FirstName} {reel.Author.LastName}".Trim();

            return Result.Success(new ReelDto(
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
                IsOwnReel: request.CurrentUserId.HasValue && reel.AuthorId == request.CurrentUserId.Value,
                IsLikedByCurrentUser: hasUserReaction));
        }
    }
}
