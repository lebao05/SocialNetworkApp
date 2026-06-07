using Application.Abstractions.Messaging;
using Application.DTOs.Stories;
using Application.Shared;

namespace Application.Stories.Queries.GetStoryTimeline;

public sealed record GetStoryTimelineQuery(
    Guid UserId,
    int Page = 1,
    int PageSize = 10
) : IQuery<PagedList<StoryTimelineUserDto>>;
