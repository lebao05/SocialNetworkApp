using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Stories;
using Domain.Entities;
using Domain.Shared;

namespace Application.Stories.Queries.GetStoriesByUserId;

internal sealed class GetStoriesByUserIdQueryHandler : IQueryHandler<GetStoriesByUserIdQuery, List<StoryDto>>
{
    private readonly IStoryRepository _storyRepository;

    public GetStoriesByUserIdQueryHandler(IStoryRepository storyRepository)
    {
        _storyRepository = storyRepository;
    }

    public async Task<Result<List<StoryDto>>> Handle(GetStoriesByUserIdQuery request, CancellationToken cancellationToken)
    {
        var stories = await _storyRepository.GetByUserIdAsync(request.UserId, cancellationToken);

        var items = stories
            .OrderByDescending(story => story.CreatedAt)
            .Select(story => Map(story, request.CurrentUserId))
            .ToList();

        return Result.Success(items);
    }

    private static StoryDto Map(Story story, Guid? currentUserId)
    {
        var isSeenByCurrentUser = currentUserId.HasValue
            && story.SeenByUsers.Any(seen => seen.UserId == currentUserId.Value);

        var isLikedByCurrentUser = currentUserId.HasValue
            && story.Reactions.Any(reaction => reaction.UserId == currentUserId.Value);

        var authorName = story.User is null
            ? "Người dùng"
            : $"{story.User.FirstName} {story.User.LastName}".Trim();

        return new StoryDto(
            story.Id,
            story.UserId,
            string.IsNullOrWhiteSpace(authorName) ? "Người dùng" : authorName,
            story.User?.AvatarUrl,
            story.MediaUrl,
            story.MediaType.ToString(),
            story.BackgroundGradient,
            story.TextContent,
            story.TextColor,
            story.TextStyle,
            story.TextPositionX,
            story.TextPositionY,
            story.FontFamily,
            story.Reactions.Count,
            story.SeenByUsers.Count,
            story.CreatedAt,
            story.ExpiresAt,
            currentUserId.HasValue && story.UserId == currentUserId.Value,
            isSeenByCurrentUser,
            isLikedByCurrentUser);
    }
}
