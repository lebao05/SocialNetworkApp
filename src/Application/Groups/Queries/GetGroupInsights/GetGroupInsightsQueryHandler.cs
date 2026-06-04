using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Groups;
using Domain.Enums;
using Domain.Shared;

namespace Application.Groups.Queries.GetGroupInsights
{
    internal sealed class GetGroupInsightsQueryHandler
        : IQueryHandler<GetGroupInsightsQuery, GroupInsightsDto>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IPostRepository _postRepository;

        public GetGroupInsightsQueryHandler(
            IGroupRepository groupRepository,
            IPostRepository postRepository)
        {
            _groupRepository = groupRepository;
            _postRepository = postRepository;
        }

        public async Task<Result<GroupInsightsDto>> Handle(
            GetGroupInsightsQuery request,
            CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdWithMembersAsync(request.GroupId, cancellationToken);
            if (group is null)
            {
                return Result.Failure<GroupInsightsDto>(new Error(
                    "Group.NotFound",
                    $"Group with id {request.GroupId} was not found."));
            }

            var isModeratorOrAdmin = group.IsModeratorOrAdmin(request.RequesterUserId);
            if (!isModeratorOrAdmin)
            {
                return Result.Failure<GroupInsightsDto>(new Error(
                    "Group.Forbidden",
                    "Only moderators and admins can view group insights."));
            }

            // ── Date range ──────────────────────────────────────────────────────
            var fromDate = request.FromDate ?? DateTime.UtcNow.AddDays(-30);
            var toDate = request.ToDate ?? DateTime.UtcNow;

            // ── Member stats ───────────────────────────────────────────────────
            var totalMembers = group.Members.Count;
            var requests = group.Requests.Count(r =>
                r.CreatedAt >= fromDate && r.CreatedAt <= toDate);

            var reviewed = group.Requests.Count(r =>
                r.Status != GroupRequestStatus.Pending &&
                r.UpdatedAt >= fromDate && r.UpdatedAt <= toDate);

            var approved = group.Requests.Count(r =>
                r.Status == GroupRequestStatus.Accepted &&
                r.UpdatedAt >= fromDate && r.UpdatedAt <= toDate);

            var declined = group.Requests.Count(r =>
                r.Status == GroupRequestStatus.Rejected &&
                r.UpdatedAt >= fromDate && r.UpdatedAt <= toDate);

            // ── Post stats ─────────────────────────────────────────────────────
            var posts = await _postRepository.GetByGroupIdAsync(request.GroupId, null, cancellationToken);
            var postsInRange = posts
                .Where(p => p.CreatedAt >= fromDate && p.CreatedAt <= toDate)
                .ToList();

            var postIds = postsInRange.Select(p => p.Id).ToList();
            var postCount = postsInRange.Count;

            // ── Comment + reaction counts ──────────────────────────────────────
            var comments = 0;
            var reactions = 0;

            if (postIds.Count != 0)
            {
                comments = await _postRepository.GetCommentCountByPostIdsAsync(postIds, cancellationToken);
                reactions = await _postRepository.GetReactionCountByPostIdsAsync(postIds, cancellationToken);
            }

            // ── Active members (members who posted in range) ─────────────────────
            var activeMembers = postsInRange
                .Select(p => p.AuthorId)
                .Distinct()
                .Count();

            // ── Peak hours (0-23) ───────────────────────────────────────────────
            var peakHours = Enumerable.Range(0, 24)
                .Select(h => new ChartDataPoint($"{h}:00", postsInRange.Count(p => p.CreatedAt.Hour == h)))
                .OrderByDescending(x => x.Count)
                .Take(5)
                .ToList();

            // ── Top days (last 7 days) ─────────────────────────────────────────
            var topDays = Enumerable.Range(0, 7)
                .Select(offset =>
                {
                    var date = DateTime.UtcNow.Date.AddDays(-offset);
                    var label = date.ToString("ddd dd/MM");
                    var count = postsInRange.Count(p => p.CreatedAt.Date == date);
                    return new ChartDataPoint(label, count);
                })
                .OrderByDescending(x => x.Count)
                .Take(5)
                .ToList();

            // ── Growth chart (daily member count) ───────────────────────────────
            var growthChart = new List<ChartDataPoint>();
            for (var date = fromDate.Date; date <= toDate.Date; date = date.AddDays(1))
            {
                var count = group.Members.Count(m => m.CreatedAt.Date <= date);
                growthChart.Add(new ChartDataPoint(date.ToString("dd/MM"), count));
            }

            // ── Engagement chart (daily post count) ────────────────────────────
            var engagementChart = new List<ChartDataPoint>();
            for (var date = fromDate.Date; date <= toDate.Date; date = date.AddDays(1))
            {
                var count = postsInRange.Count(p => p.CreatedAt.Date == date);
                engagementChart.Add(new ChartDataPoint(date.ToString("dd/MM"), count));
            }

            return Result.Success(new GroupInsightsDto(
                totalMembers,
                requests,
                reviewed,
                approved,
                declined,
                postCount,
                comments,
                reactions,
                activeMembers,
                topDays,
                peakHours,
                growthChart,
                engagementChart));
        }
    }
}
