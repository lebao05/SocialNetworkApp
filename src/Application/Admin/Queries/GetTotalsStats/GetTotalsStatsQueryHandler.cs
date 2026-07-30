using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Abstractions.SignalR;
using Application.DTOs.Admin;
using Domain.Shared;

namespace Application.Admin.Queries.GetTotalsStats;

internal sealed class GetTotalsStatsQueryHandler : IQueryHandler<GetTotalsStatsQuery, DashboardTotalsDto>
{
    private readonly IUserRepository _users;
    private readonly IPostRepository _posts;
    private readonly IReelRepository _reels;
    private readonly IGroupRepository _groups;
    private readonly IPresenceTracker _presence;

    public GetTotalsStatsQueryHandler(
        IUserRepository users,
        IPostRepository posts,
        IReelRepository reels,
        IGroupRepository groups,
        IPresenceTracker presence)
    {
        _users = users;
        _posts = posts;
        _reels = reels;
        _groups = groups;
        _presence = presence;
    }

    public async Task<Result<DashboardTotalsDto>> Handle(
        GetTotalsStatsQuery request,
        CancellationToken cancellationToken)
    {
        // Fan out the 4 DB COUNTs concurrently. Presence is an in-memory
        // dictionary lookup so it's negligible compared to the DB round-trips.
        var usersTask  = _users.GetTotalCountAsync(cancellationToken);
        var postsTask  = _posts.GetTotalCountAsync(cancellationToken);
        var reelsTask  = _reels.GetTotalCountAsync(cancellationToken);
        var groupsTask = _groups.GetActiveGroupCountAsync(cancellationToken);

        await Task.WhenAll(usersTask, postsTask, reelsTask, groupsTask);

        var onlineNow = _presence.GetOnlineUsers().Count;

        return Result.Success(new DashboardTotalsDto(
            TotalUsers:       await usersTask,
            TotalPosts:       await postsTask,
            TotalReels:       await reelsTask,
            OnlineNow:        onlineNow,
            TotalActiveGroups: await groupsTask));
    }
}