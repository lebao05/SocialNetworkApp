using Application.Abstractions.Messaging;
using Application.DTOs.Reels;

namespace Application.Reels.Queries.GetReelById
{
    public sealed record GetReelByIdQuery(
        long ReelId,
        Guid? CurrentUserId = null
    ) : IQuery<ReelDto>;
}
