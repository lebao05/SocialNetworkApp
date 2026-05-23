using Application.Abstractions;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public sealed class FeedGenerator : IFeedGenerator
    {
        private const int RecentFeedWindow = 100;
        private const double FriendScore = 40;
        private const double FollowingScore = 20;
        private const double OwnScore = 25;
        private const double ActiveGroupScore = 30;
        private const double AuthorDiversityPenalty = 20;
        private const int RelationshipCandidateLimit = 200;
        private const int FriendPostCandidateLimit = 150;
        private const int FollowingPostCandidateLimit = 100;
        private const int GroupPostCandidateLimit = 100;
        private const int OtherPostCandidateLimit = 30;

        private readonly AppDbContext _context;

        public FeedGenerator(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> GenerateAsync(
            Guid userId,
            int candidateLimit = 500,
            int feedItemLimit = 100,
            CancellationToken cancellationToken = default)
        {
            var now = DateTime.UtcNow;

            var friendIds = await GetTopFriendIdsAsync(userId, RelationshipCandidateLimit, cancellationToken);

            var followingIds = await GetTopFollowingIdsAsync(userId, RelationshipCandidateLimit, cancellationToken);

            var groupIds = await _context.GroupMembers
                .Where(member => member.UserId == userId)
                .Select(member => member.GroupId)
                .ToHashSetAsync(cancellationToken);

            var groupInterestScores = await _context.InterestGroupScores
                .Where(score => score.UserId == userId && groupIds.Contains(score.GroupId))
                .ToDictionaryAsync(score => score.GroupId, score => score.Score, cancellationToken);

            var recentPostIds = await _context.UserFeeds
                .Where(feed => feed.UserId == userId)
                .OrderByDescending(feed => feed.Id)
                .Take(RecentFeedWindow)
                .Select(feed => feed.PostId)
                .ToHashSetAsync(cancellationToken);

            var friendPosts = await _context.Posts
                .AsNoTracking()
                .Where(post => friendIds.Contains(post.AuthorId))
                .OrderByDescending(post => post.CreatedAt)
                .Take(FriendPostCandidateLimit)
                .ToListAsync(cancellationToken);

            var followingPosts = await _context.Posts
                .AsNoTracking()
                .Where(post => followingIds.Contains(post.AuthorId))
                .OrderByDescending(post => post.CreatedAt)
                .Take(FollowingPostCandidateLimit)
                .ToListAsync(cancellationToken);

            var groupPosts = await _context.Posts
                .AsNoTracking()
                .Where(post => post.GroupId.HasValue && groupIds.Contains(post.GroupId.Value))
                .OrderByDescending(post => post.CreatedAt)
                .Take(GroupPostCandidateLimit)
                .ToListAsync(cancellationToken);

            var otherPosts = await _context.Posts
                .AsNoTracking()
                .Where(post =>
                    post.AuthorId != userId
                    && !friendIds.Contains(post.AuthorId)
                    && !followingIds.Contains(post.AuthorId)
                    && post.Visibility == PostVisibility.Public
                    && (!post.GroupId.HasValue || !groupIds.Contains(post.GroupId.Value)))
                .OrderByDescending(post => post.CreatedAt)
                .Take(OtherPostCandidateLimit)
                .ToListAsync(cancellationToken);

            var ownPosts = await _context.Posts
                .AsNoTracking()
                .Where(post => post.AuthorId == userId)
                .OrderByDescending(post => post.CreatedAt)
                .Take(Math.Max(0, candidateLimit - FriendPostCandidateLimit - FollowingPostCandidateLimit - GroupPostCandidateLimit - OtherPostCandidateLimit))
                .ToListAsync(cancellationToken);

            var candidates = friendPosts
                .Concat(followingPosts)
                .Concat(groupPosts)
                .Concat(otherPosts)
                .Concat(ownPosts)
                .GroupBy(post => post.Id)
                .Select(group => group.First())
                .Take(candidateLimit)
                .ToList();

            var candidatePostIds = candidates.Select(post => post.Id).ToHashSet();
            var reactionCounts = await _context.Reactions
                .Where(reaction => reaction.PostId.HasValue && candidatePostIds.Contains(reaction.PostId.Value))
                .GroupBy(reaction => reaction.PostId!.Value)
                .Select(group => new { PostId = group.Key, Count = group.Count() })
                .ToDictionaryAsync(group => group.PostId, group => group.Count, cancellationToken);

            var commentCounts = await _context.PostComments
                .Where(comment => candidatePostIds.Contains(comment.PostId) && comment.DeletedAt == null)
                .GroupBy(comment => comment.PostId)
                .Select(group => new { PostId = group.Key, Count = group.Count() })
                .ToDictionaryAsync(group => group.PostId, group => group.Count, cancellationToken);

            var shareCounts = await _context.Posts
                .Where(post => post.SharePostId.HasValue && candidatePostIds.Contains(post.SharePostId.Value))
                .GroupBy(post => post.SharePostId!.Value)
                .Select(group => new { PostId = group.Key, Count = group.Count() })
                .ToDictionaryAsync(group => group.PostId, group => group.Count, cancellationToken);

            var scoredCandidates = candidates
                .Where(post => !recentPostIds.Contains(post.Id))
                .Select(post =>
                {
                    var score = CalculateScore(
                        post,
                        now,
                        userId,
                        friendIds,
                        followingIds,
                        groupIds,
                        reactionCounts,
                        commentCounts,
                        shareCounts,
                        groupInterestScores);

                    return new ScoredPost(post, score, ResolveFeedType(post, userId, friendIds, followingIds, groupIds));
                })
                .OrderByDescending(candidate => candidate.Score)
                .ToList();

            var arranged = ApplyDiversityPenalty(scoredCandidates)
                .Take(feedItemLimit)
                .ToList();

            foreach (var candidate in arranged)
            {
                _context.UserFeeds.Add(new UserFeed(
                    id: 0,
                    userId: userId,
                    postId: candidate.Post.Id,
                    sourceUserId: candidate.Post.AuthorId,
                    score: (float)candidate.Score,
                    feedType: candidate.FeedType));
            }

            if (arranged.Count == 0)
            {
                return 0;
            }

            await _context.SaveChangesAsync(cancellationToken);

            return arranged.Count;
        }

        private static double CalculateScore(
            Post post,
            DateTime now,
            Guid userId,
            HashSet<Guid> friendIds,
            HashSet<Guid> followingIds,
            HashSet<long> groupIds,
            IReadOnlyDictionary<long, int> reactionCounts,
            IReadOnlyDictionary<long, int> commentCounts,
            IReadOnlyDictionary<long, int> shareCounts,
            IReadOnlyDictionary<long, float> groupInterestScores)
        {
            var hours = Math.Max(0, (now - post.CreatedAt).TotalHours);
            var freshnessScore = 100 / (1 + hours);

            var relationshipScore = 0.0;
            if (post.AuthorId == userId)
            {
                relationshipScore += OwnScore;
            }

            if (friendIds.Contains(post.AuthorId))
            {
                relationshipScore += FriendScore;
            }

            if (followingIds.Contains(post.AuthorId))
            {
                relationshipScore += FollowingScore;
            }

            var engagementScore =
                reactionCounts.GetValueOrDefault(post.Id)
                + (commentCounts.GetValueOrDefault(post.Id) * 3)
                + (shareCounts.GetValueOrDefault(post.Id) * 5);

            var interestScore = 0.0;
            var groupScore = 0.0;

            if (post.GroupId.HasValue && groupIds.Contains(post.GroupId.Value))
            {
                groupScore += ActiveGroupScore;
                var groupInterestScore = groupInterestScores.GetValueOrDefault(post.GroupId.Value);
                groupScore += Math.Min(60, groupInterestScore);
                interestScore += groupInterestScore;
            }

            return freshnessScore + relationshipScore + engagementScore + interestScore + groupScore;
        }

        private async Task<HashSet<Guid>> GetTopFriendIdsAsync(
            Guid userId,
            int limit,
            CancellationToken cancellationToken)
        {
            var friendIds = await _context.Friendships
                .Where(friendship => friendship.User1Id == userId || friendship.User2Id == userId)
                .Select(friendship => friendship.User1Id == userId ? friendship.User2Id : friendship.User1Id)
                .ToListAsync(cancellationToken);

            return await RankRelationshipIdsByInterestAsync(userId, friendIds, limit, cancellationToken);
        }

        private async Task<HashSet<Guid>> GetTopFollowingIdsAsync(
            Guid userId,
            int limit,
            CancellationToken cancellationToken)
        {
            var followingIds = await _context.Followings
                .Where(following => following.FollowerId == userId)
                .OrderByDescending(following => following.CreatedAt)
                .Select(following => following.FolloweeId)
                .ToListAsync(cancellationToken);

            return await RankRelationshipIdsByInterestAsync(userId, followingIds, limit, cancellationToken);
        }

        private async Task<HashSet<Guid>> RankRelationshipIdsByInterestAsync(
            Guid userId,
            IReadOnlyCollection<Guid> relationshipIds,
            int limit,
            CancellationToken cancellationToken)
        {
            if (relationshipIds.Count <= limit)
            {
                return relationshipIds.ToHashSet();
            }

            var interestScores = await _context.InterestRelationshipScores
                .Where(score => score.UserId == userId && relationshipIds.Contains(score.TargetUserId))
                .Select(score => new
                {
                    score.TargetUserId,
                    score.Score,
                    score.LastInteractionAt
                })
                .ToListAsync(cancellationToken);

            var rankedIds = interestScores
                .OrderByDescending(score => score.Score)
                .ThenByDescending(score => score.LastInteractionAt)
                .Select(score => score.TargetUserId)
                .Take(limit)
                .ToList();

            if (rankedIds.Count < limit)
            {
                rankedIds.AddRange(relationshipIds
                    .Where(id => !rankedIds.Contains(id))
                    .Take(limit - rankedIds.Count));
            }

            return rankedIds.ToHashSet();
        }

        private static IEnumerable<ScoredPost> ApplyDiversityPenalty(IReadOnlyList<ScoredPost> candidates)
        {
            var authorCounts = new Dictionary<Guid, int>();

            foreach (var candidate in candidates)
            {
                var sameAuthorCount = authorCounts.GetValueOrDefault(candidate.Post.AuthorId);
                var adjustedScore = candidate.Score - (sameAuthorCount * AuthorDiversityPenalty);

                authorCounts[candidate.Post.AuthorId] = sameAuthorCount + 1;

                yield return candidate with { Score = adjustedScore };
            }
        }

        private static UserFeedType ResolveFeedType(
            Post post,
            Guid userId,
            HashSet<Guid> friendIds,
            HashSet<Guid> followingIds,
            HashSet<long> groupIds)
        {
            if (post.AuthorId == userId)
            {
                return UserFeedType.Own;
            }

            if (post.GroupId.HasValue && groupIds.Contains(post.GroupId.Value))
            {
                return UserFeedType.Group;
            }

            if (friendIds.Contains(post.AuthorId))
            {
                return UserFeedType.Friend;
            }

            if (followingIds.Contains(post.AuthorId))
            {
                return UserFeedType.Following;
            }

            return UserFeedType.Public;
        }

        private sealed record ScoredPost(Post Post, double Score, UserFeedType FeedType);
    }
}
