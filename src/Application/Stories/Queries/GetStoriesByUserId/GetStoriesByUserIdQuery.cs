using Application.Abstractions.Messaging;
using Application.DTOs.Stories;

namespace Application.Stories.Queries.GetStoriesByUserId;

public sealed record GetStoriesByUserIdQuery(
    Guid UserId,
    Guid? CurrentUserId = null
) : IQuery<List<StoryDto>>;
