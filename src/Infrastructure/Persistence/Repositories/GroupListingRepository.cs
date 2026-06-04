using Application.Abstractions.Repositories;
using Application.DTOs.Groups;
using Application.Shared;
using Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public sealed class GroupListingRepository : IGroupListingRepository
{
    private readonly AppDbContext _context;

    public GroupListingRepository(AppDbContext context) => _context = context;

    public async Task<PagedList<GroupCardDto>> GetGroupsAsync(
        Guid currentUserId,
        bool isJoining,
        int page,
        int pageSize,
        string? searchTerm,
        CancellationToken cancellationToken = default)
    {
        var cutoff = DateTime.UtcNow.AddDays(-30);

        // All group IDs the user is a member of
        var memberGroupIds = await _context.GroupMembers
            .AsNoTracking()
            .Where(gm => gm.UserId == currentUserId)
            .Select(gm => gm.GroupId)
            .ToListAsync(cancellationToken);

        // Base query: joined groups if isJoining=true, non-joined groups if isJoining=false
        var query = _context.Groups
            .AsNoTracking()
            .Include(g => g.Members)
            .Where(g => isJoining ? memberGroupIds.Contains(g.Id) : !memberGroupIds.Contains(g.Id));

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(g => g.Name.ToLower().Contains(term));
        }

        var groups = await query
            .OrderBy(g => g.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var groupIds = groups.Select(g => g.Id).ToList();

        // Batch-fetch posts in last 30 days
        var postCounts = await _context.Posts
            .AsNoTracking()
            .Where(p => groupIds.Contains(p.GroupId ?? 0) && p.GroupId != null && p.CreatedAt >= cutoff)
            .GroupBy(p => p.GroupId!.Value)
            .Select(g => new { GroupId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.GroupId, x => x.Count, cancellationToken);

        // Batch-fetch friend-in-group info
        var friendIds = await _context.Friendships
            .AsNoTracking()
            .Where(f => f.User1Id == currentUserId || f.User2Id == currentUserId)
            .Select(f => new { f.User1Id, f.User2Id })
            .ToListAsync(cancellationToken);

        var friendIdList = friendIds
            .SelectMany(f => new[] { f.User1Id, f.User2Id })
            .Where(id => id != currentUserId)
            .Distinct()
            .ToList();

        var friendInGroup = await _context.GroupMembers
           .AsNoTracking()
           .Include(gm => gm.User)
           .Where(gm =>
               groupIds.Contains(gm.GroupId) &&
               friendIdList.Contains(gm.UserId))
           .ToListAsync(cancellationToken);

        var friendInGroupLookup = friendInGroup
            .GroupBy(gm => gm.GroupId)
            .ToDictionary(
                g => g.Key,
                g => g.Select(gm => new GroupCardMemberDto(
                    gm.UserId,
                    $"{gm.User.FirstName} {gm.User.LastName}".Trim(),
                    gm.User.AvatarUrl
                )).Take(3).ToList()
            );

        var friendCountByGroup = friendInGroup
            .GroupBy(gm => gm.GroupId)
            .ToDictionary(g => g.Key, g => g.Count());

        var cards = groups.Select(g => new GroupCardDto(
            g.Id,
            g.Name,
            g.CoverPhotoUrl,
            g.PrivacyType.ToString(),
            g.Members.Count,
            postCounts.GetValueOrDefault(g.Id),
            friendInGroupLookup.GetValueOrDefault(g.Id, new List<GroupCardMemberDto>()),
            friendCountByGroup.GetValueOrDefault(g.Id, 0)
        )).ToList();

        var totalCount = await query.CountAsync(cancellationToken);

        return new PagedList<GroupCardDto>(cards, page, pageSize, totalCount);
    }
}
