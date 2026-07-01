using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Stories;
using Application.Shared;
using Domain.Entities;
using Domain.Shared;

namespace Application.Stories.Queries.GetStoryTimeline;

internal sealed class GetStoryTimelineQueryHandler : IQueryHandler<GetStoryTimelineQuery, PagedList<StoryTimelineUserDto>>
{
    private readonly IStoryRepository _storyRepository;

    public GetStoryTimelineQueryHandler(IStoryRepository storyRepository)
    {
        _storyRepository = storyRepository;
    }

    public async Task<Result<PagedList<StoryTimelineUserDto>>> Handle(GetStoryTimelineQuery request, CancellationToken cancellationToken)
    {
        var page = Math.Max(1, request.Page);
        var pageSize = Math.Clamp(request.PageSize, 1, 50);

        var timelinePage = await _storyRepository.GetTimelineUsersPagedAsync(request.UserId, page, pageSize, cancellationToken);
        var pagedUserIds = timelinePage.Items.Select(item => item.UserId).ToList();
        var ownStories = page == 1
            ? await _storyRepository.GetOwnActiveStoriesAsync(request.UserId, cancellationToken)
            : new List<Story>();

        var allUserIds = ownStories
            .Select(story => story.UserId)
            .Concat(pagedUserIds)
            .Distinct()
            .ToList();

        var stories = await _storyRepository.GetActiveStoriesByUserIdsAsync(allUserIds, cancellationToken);
        var storiesByUserId = stories
            .GroupBy(story => story.UserId)
            .ToDictionary(group => group.Key, group => group.OrderBy(story => story.CreatedAt).ToList());

        var timelineItems = new List<StoryTimelineUserDto>();

        if (page == 1 && storiesByUserId.TryGetValue(request.UserId, out var ownStoryGroup) && ownStoryGroup.Count > 0)
        {
            timelineItems.Add(MapTimelineUserDto(ownStoryGroup, request.UserId, hasUnseenStories: false));
        }

        foreach (var pageItem in timelinePage.Items)
        {
            if (!storiesByUserId.TryGetValue(pageItem.UserId, out var userStories) || userStories.Count == 0)
            {
                continue;
            }

            timelineItems.Add(MapTimelineUserDto(userStories, request.UserId, pageItem.HasUnseenStories));
        }

        var totalCount = timelinePage.TotalCount + (page == 1 && ownStories.Count > 0 ? 1 : 0);

        return Result.Success(new PagedList<StoryTimelineUserDto>(timelineItems, page, pageSize, totalCount));
    }

    private static StoryTimelineUserDto MapTimelineUserDto(
        List<Story> orderedStories,
        Guid currentUserId,
        bool hasUnseenStories)
    {
        var firstStory = orderedStories[0];
        var authorName = string.Join(" ", new[] { firstStory.User?.FirstName, firstStory.User?.LastName }
            .Where(value => !string.IsNullOrWhiteSpace(value)));

        return new StoryTimelineUserDto(
            firstStory.UserId,
            authorName,
            firstStory.User?.AvatarUrl,
            hasUnseenStories);
    }

    private static StoryDto MapStory(Story story, Guid currentUserId)
    {
        var isSeenByCurrentUser = story.SeenByUsers.Any(seen => seen.UserId == currentUserId);
        var isLikedByCurrentUser = story.Reactions.Any(reaction => reaction.UserId == currentUserId);

        var authorName = $"{story.User.FirstName} {story.User.LastName}".Trim();

        return new StoryDto(
            story.Id,
            story.UserId,
            authorName,
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
            story.UserId == currentUserId,
            isSeenByCurrentUser,
            isLikedByCurrentUser);
    }
}
