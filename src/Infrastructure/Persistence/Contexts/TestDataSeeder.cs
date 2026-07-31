using Domain.Entities;
using Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Persistence.Contexts;

/// <summary>
/// Seeds diversified test data for the admin dashboard and general app testing.
/// Idempotent — skips if data already exists.
/// Run via: GET/POST /admin/seed-test-data
/// </summary>
public static class TestDataSeeder
{
    // ── Test user credentials (all: Password = "Test@123") ──────────────────
    private const string TestPassword = "Test@123";

    private static readonly (string Email, string First, string Last, Gender Gender, DateOnly Dob)[] TestUsers =
    [
        ("alice@example.com",  "Alice",  "Johnson", Gender.Female, new DateOnly(1995,  3, 15)),
        ("bob@example.com",    "Bob",    "Smith",   Gender.Male,   new DateOnly(1992,  7, 22)),
        ("charlie@example.com","Charlie","Brown",    Gender.Male,   new DateOnly(1998, 11,  5)),
        ("diana@example.com",  "Diana",  "Lee",      Gender.Female, new DateOnly(1990,  1, 30)),
        ("evan@example.com",   "Evan",   "Garcia",   Gender.Male,   new DateOnly(2001,  6, 18)),
        ("fiona@example.com",  "Fiona",  "Martinez", Gender.Female, new DateOnly(1997,  9,  2)),
        ("george@example.com", "George", "Wilson",   Gender.Male,   new DateOnly(1988,  4, 25)),
        ("hannah@example.com",  "Hannah", "Taylor",   Gender.Female, new DateOnly(2003, 12, 11)),
        ("ian@example.com",    "Ian",    "Anderson", Gender.Male,   new DateOnly(1994,  8,  7)),
        ("julia@example.com",  "Julia",  "Thomas",   Gender.Female, new DateOnly(1996,  2, 19)),
        ("kyle@example.com",   "Kyle",   "Jackson",  Gender.Male,   new DateOnly(1999,  5, 14)),
        ("luna@example.com",   "Luna",   "White",    Gender.Female, new DateOnly(2000, 10, 28)),
        ("marcus@example.com",  "Marcus", "Harris",   Gender.Male,   new DateOnly(1993,  3,  3)),
        ("nina@example.com",   "Nina",   "Clark",    Gender.Female, new DateOnly(2002,  7,  9)),
        ("oscar@example.com",   "Oscar",  "Lewis",    Gender.Male,   new DateOnly(1991, 11, 21)),
    ];

    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        var logger = serviceProvider.GetRequiredService<ILoggerFactory>()
            .CreateLogger("TestDataSeeder");

        logger.LogInformation("TestDataSeeder starting...");

        await using var scope = serviceProvider.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

        // ── 1. Bail if users already exist ────────────────────────────────
        if (await db.Users.AnyAsync(u => u.Email != RoleSeeder.AdminEmail))
        {
            logger.LogInformation("Test data already exists. Skipping.");
            return;
        }

        // ── 2. Create test users ──────────────────────────────────────────
        var userIds = new Guid[TestUsers.Length];
        for (int i = 0; i < TestUsers.Length; i++)
        {
            var (email, first, last, gender, dob) = TestUsers[i];
            var user = new User(first, last, dob, gender, email);
            var result = await userManager.CreateAsync(user, TestPassword);
            if (result.Succeeded)
            {
                userIds[i] = user.Id;
                logger.LogInformation("Created test user {Email} ({Id})", email, user.Id);
            }
            else
            {
                logger.LogWarning("Failed to create user {Email}: {Errors}",
                    email, string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }

        // ── 3. Ensure IsLocked columns exist (may not exist until migration runs) ─
        await EnsureIsLockedColumnsAsync(db, logger);

        // ── 4. Seed via raw SQL (for explicit IDs & staggered timestamps) ─
        await SeedRawDataAsync(db, logger);

        logger.LogInformation("TestDataSeeder finished.");
    }

    private static async Task EnsureIsLockedColumnsAsync(AppDbContext db, ILogger logger)
    {
        try
        {
            // Add IsLocked to Posts if it doesn't exist yet (run before migration is applied)
            await db.Database.ExecuteSqlRawAsync(
                @"ALTER TABLE ""Posts"" ADD COLUMN IF NOT EXISTS ""IsLocked"" BOOLEAN NOT NULL DEFAULT FALSE");

            // Add IsLocked to Reels if it doesn't exist yet
            await db.Database.ExecuteSqlRawAsync(
                @"ALTER TABLE ""Reels"" ADD COLUMN IF NOT EXISTS ""IsLocked"" BOOLEAN NOT NULL DEFAULT FALSE");

            logger.LogInformation("Ensured IsLocked columns exist on Posts and Reels.");
        }
        catch (Exception ex)
        {
            // If it fails, the migration probably already applied — safe to ignore
            logger.LogWarning(ex, "Could not add IsLocked columns (may already exist or migration already applied).");
        }
    }

    private static async Task SeedRawDataAsync(AppDbContext db, ILogger logger)
    {
        var now = DateTime.UtcNow;
        var random = new Random(42); // deterministic for reproducibility

        // ── Stagger user created-at dates (spread across last 90 days) ───
        var userIds = await db.Users
            .Where(u => u.Email != RoleSeeder.AdminEmail)
            .OrderBy(u => u.Id)
            .Select(u => u.Id)
            .ToListAsync();

        if (userIds.Count < 5)
        {
            logger.LogWarning("Not enough users for seeding. Need at least 5 test users.");
            return;
        }

        // Widen the registration spread for a realistic growth curve
        var staggerDays = Enumerable.Range(0, userIds.Count)
            .Select(i => now.AddDays(-90 + (i * 6) + random.Next(0, 4)))
            .Select(d => d.ToUniversalTime())
            .ToArray();

        for (int i = 0; i < userIds.Count; i++)
        {
            await db.Database.ExecuteSqlInterpolatedAsync(
                $"UPDATE \"AspNetUsers\" SET \"CreatedAt\" = {staggerDays[i]} WHERE \"Id\" = {userIds[i]}");
        }

        logger.LogInformation("Staggered CreatedAt for {Count} users.", userIds.Count);

        // ── Posts (5 per user, spread over last 60 days) ───────────────────
        var postContents = new[]
        {
            "Just had the best coffee this morning! Perfect start to the day.",
            "Finally finished that project I've been working on for weeks.",
            "Anyone recommend a good movie to watch this weekend?",
            "Beautiful sunset today. Nature never disappoints.",
            "Learning something new every day. Growth mindset!",
            "Weekend vibes. Hope everyone is having a great time!",
            "Just discovered an amazing restaurant downtown.",
            "Grateful for all the support from friends and family.",
            "Working out feels great! Health is wealth.",
            "Excited about the upcoming trip! Can't wait.",
            "Late night coding session. Coffee is my best friend.",
            "Celebrating small wins today. Every step counts!",
            "Reading a fantastic book. Any recommendations?",
            "Family dinner was amazing. Cherish these moments.",
            "New recipe tried today. It turned out delicious!",
            "Rainy days make me feel so cozy.",
            "Trying to stay positive and focused.",
            "Just finished a great workout session!",
            "Looking forward to the long weekend.",
            "Happiness is a warm cup of tea.",
        };

        long postId = 1;
        var createdAt = now.AddDays(-60);
        var postIdMap = new List<long>(); // track post IDs

        for (int u = 0; u < userIds.Count; u++)
        {
            for (int p = 0; p < 5; p++)
            {
                var visibility = (PostVisibility)(random.Next(0, 4));
                var content = postContents[random.Next(postContents.Length)];
                var ts = createdAt.AddDays(random.NextDouble() * 60);

                await db.Database.ExecuteSqlInterpolatedAsync(
                    $@"INSERT INTO ""Posts"" (""Id"", ""AuthorId"", ""Content"", ""Visibility"", ""ApprovalStatus"",
                        ""IsHiddenFromGroup"", ""IsAnonymous"", ""CreatedAt"", ""UpdatedAt"", ""DeletedAt"")
                     VALUES ({postId}, {userIds[u]}, {content}, {(byte)visibility}, {(byte)PostApprovalStatus.Approved},
                             false, false, {ts.ToUniversalTime()}, NULL, NULL)");

                postIdMap.Add(postId);
                postId++;
                createdAt = ts;
            }
        }

        logger.LogInformation("Seeded {Count} posts.", postIdMap.Count);

        // ── Comments (8 per post, spread over post day → now) ────────────
        var commentTexts = new[]
        {
            "Great post! Really enjoyed reading this.",
            "Couldn't agree more!",
            "Thanks for sharing this.",
            "This is so true!",
            "Love it! Keep it up!",
            "Interesting perspective.",
            "I had a similar experience.",
            "Well said!",
            "This made my day better.",
            "So relatable!",
        };

        long commentId = 1;
        foreach (var postIdRef in postIdMap)
        {
            var postTs = await db.Posts.Where(x => x.Id == postIdRef).Select(x => x.CreatedAt).FirstAsync();
            for (int c = 0; c < 8; c++)
            {
                var commenterIdx = random.Next(userIds.Count);
                var commentTs = postTs.AddHours(random.Next(1, 72)).AddMinutes(random.Next(0, 59));
                var text = commentTexts[random.Next(commentTexts.Length)];

                await db.Database.ExecuteSqlInterpolatedAsync(
                    $@"INSERT INTO ""PostComments"" (""Id"", ""PostId"", ""UserId"", ""ParentCommentId"", ""RepliedUserId"",
                        ""Content"", ""CreatedAt"", ""UpdatedAt"", ""DeletedAt"")
                     VALUES ({commentId}, {postIdRef}, {userIds[commenterIdx]}, NULL, NULL,
                             {text}, {commentTs.ToUniversalTime()}, NULL, NULL)");
                commentId++;
            }
        }

        logger.LogInformation("Seeded {Count} comments.", commentId - 1);

        // ── Reels (3 per user) ────────────────────────────────────────────
        var reelCaptions = new[]
        {
            "Behind the scenes!", "Day in my life 🌟", "Quick tutorial 📸",
            "My favorite playlist 🎵", "Morning routine ☀️", "Travel vlog ✈️",
            "Cooking with me 🍳", "Workout tips 🏋️", "Study with me 📚",
            "Unboxing time! 🎁",
        };

        long reelId = 1;
        var reelIds = new List<long>();
        var reelCreatedAt = now.AddDays(-30);

        for (int u = 0; u < userIds.Count; u++)
        {
            for (int r = 0; r < 3; r++)
            {
                var visibility = (ReelVisibility)(random.Next(0, 2));
                var caption = reelCaptions[random.Next(reelCaptions.Length)];
                var ts = reelCreatedAt.AddDays(random.NextDouble() * 30).AddHours(random.NextDouble() * 24);

                await db.Database.ExecuteSqlInterpolatedAsync(
                    $@"INSERT INTO ""Reels"" (""Id"", ""AuthorId"", ""VideoUrl"", ""ThumbnailUrl"", ""Caption"",
                        ""AudioTitle"", ""Duration"", ""Visibility"", ""ViewCount"", ""CreatedAt"", ""UpdatedAt"", ""DeletedAt"")
                     VALUES ({reelId}, {userIds[u]},
                             {'/' + $"placeholder-reel-{reelId}.mp4"},
                             {'/' + $"placeholder-reel-{reelId}-thumb.jpg"},
                             {caption}, {'/' + "sample-audio.mp3"}, {'/' + $"{random.Next(15, 90)}s"},
                             {(byte)visibility}, {random.Next(10, 500)}, {ts.ToUniversalTime()}, NULL, NULL)");

                reelIds.Add(reelId);
                reelId++;
            }
        }

        logger.LogInformation("Seeded {Count} reels.", reelIds.Count);

        // ── Groups (5 groups) ─────────────────────────────────────────────
        var groupData = new[]
        {
            ("Tech Enthusiasts",      "A community for tech lovers to share and discuss the latest in technology.", GroupPrivacyType.Public),
            ("Photography Club",       "Share your photos, get feedback, and learn from fellow photographers.",        GroupPrivacyType.Public),
            ("Book Lovers",            "For those who can't put down a good book. Reviews and recommendations.",     GroupPrivacyType.Private),
            ("Fitness & Health",      "Motivation, tips, and support for your fitness journey.",                   GroupPrivacyType.Public),
            ("Game Dev Central",       "Indie and AAA game developers sharing knowledge and projects.",              GroupPrivacyType.Private),
        };

        long groupId = 1;
        var groupIds = new List<long>();
        var groupCreatedAt = now.AddDays(-80);

        foreach (var (name, desc, privacy) in groupData)
        {
            var ownerIdx = random.Next(userIds.Count);
            var ts = groupCreatedAt.AddDays(random.NextDouble() * 10);

            await db.Database.ExecuteSqlInterpolatedAsync(
                $@"INSERT INTO ""Groups"" (""GroupId"", ""OwnerUserId"", ""Name"", ""Description"", ""PrivacyType"",
                    ""CoverPhotoUrl"", ""IsPostApprovalRequired"", ""IsGroupJoinApprovalRequired"",
                    ""AllowAnonymousPost"", ""IsLocked"", ""CreatedAt"", ""UpdatedAt"", ""DeletedAt"")
                 VALUES ({groupId}, {userIds[ownerIdx]}, {name}, {desc}, {(byte)privacy},
                         NULL, false, false, false, false, {ts.ToUniversalTime()}, NULL, NULL)");

            groupIds.Add(groupId);
            groupId++;
        }

        // Add some members to each group
        long gmId = 1;
        foreach (var gid in groupIds)
        {
            var memberCount = random.Next(4, 8);
            var shuffled = userIds.OrderBy(_ => random.Next()).Take(memberCount).ToList();
            foreach (var uid in shuffled)
            {
                await db.Database.ExecuteSqlInterpolatedAsync(
                    $@"INSERT INTO ""GroupMembers"" (""Id"", ""GroupId"", ""UserId"", ""Role"",
                        ""JoinedAt"", ""ApprovedAt"", ""DeletedAt"")
                     VALUES ({gmId}, {gid}, {uid}, {(byte)GroupMemberRole.Member},
                             {now.AddDays(-random.Next(1, 70))}, {now.AddDays(-random.Next(1, 30))}, NULL)");
                gmId++;
            }
        }

        logger.LogInformation("Seeded {Count} groups with members.", groupIds.Count);

        // ── Reports (2 per content type, varied statuses) ─────────────────
        var reportReasons = new[]
        {
            (byte)ReportReason.Spam,
            (byte)ReportReason.Harassment,
            (byte)ReportReason.HateSpeech,
            (byte)ReportReason.Other,
            (byte)ReportReason.Misinformation,
            (byte)ReportReason.NudityOrSexual,
        };

        // Reports for posts
        for (int i = 0; i < Math.Min(5, postIdMap.Count); i++)
        {
            var reporterIdx = random.Next(userIds.Count);
            var reporterId = userIds[reporterIdx];
            var targetPostId = postIdMap[i];
            var reason = reportReasons[random.Next(reportReasons.Length)];
            var status = (byte)((i % 3 == 0) ? ReportStatus.Pending : (i % 3 == 1 ? ReportStatus.Reviewed : ReportStatus.Dismissed));
            var ts = now.AddDays(-random.Next(1, 30));
            var reviewNote = status switch
            {
                (byte)ReportStatus.Reviewed  => "Action taken. Content removed.",
                (byte)ReportStatus.Dismissed => "No violation found.",
                _                            => (string?)null
            };
            var reviewedBy = status != (byte)ReportStatus.Pending ? userIds[0] : (Guid?)null;
            var reviewedAt = status != (byte)ReportStatus.Pending ? ts.AddDays(1) : (DateTime?)null;

            await db.Database.ExecuteSqlInterpolatedAsync(
                $@"INSERT INTO ""Reports"" (""ReporterId"", ""ReportType"", ""PostId"", ""ReelId"", ""UserId"", ""GroupId"",
                    ""Reason"", ""Details"", ""Status"", ""ReviewedByUserId"", ""ReviewedAt"", ""ReviewNote"",
                    ""CreatedAt"", ""UpdatedAt"", ""DeletedAt"")
                 VALUES ({reporterId}, {(byte)ReportType.Post}, {targetPostId}, NULL, NULL, NULL,
                         {reason}, {"Suspicious content posted."}, {status},
                         {reviewedBy}, {reviewedAt}, {reviewNote},
                         {ts}, NULL, NULL)");
        }

        // Reports for users
        for (int i = 0; i < 3; i++)
        {
            var reporterIdx = random.Next(userIds.Count);
            var reporterId = userIds[reporterIdx];
            var targetUserId = userIds[(reporterIdx + 1) % userIds.Count];
            var reason = reportReasons[random.Next(reportReasons.Length)];
            var status = (byte)ReportStatus.Pending;
            var ts = now.AddDays(-random.Next(1, 15));

            await db.Database.ExecuteSqlInterpolatedAsync(
                $@"INSERT INTO ""Reports"" (""ReporterId"", ""ReportType"", ""PostId"", ""ReelId"", ""UserId"", ""GroupId"",
                    ""Reason"", ""Details"", ""Status"", ""ReviewedByUserId"", ""ReviewedAt"", ""ReviewNote"",
                    ""CreatedAt"", ""UpdatedAt"", ""DeletedAt"")
                 VALUES ({reporterId}, {(byte)ReportType.User}, NULL, NULL, {targetUserId}, NULL,
                         {reason}, {"Inappropriate user behavior."}, {status}, NULL, NULL, NULL,
                         {ts}, NULL, NULL)");
        }

        // Reports for groups
        for (int i = 0; i < 2; i++)
        {
            if (i >= groupIds.Count) break;
            var reporterIdx = random.Next(userIds.Count);
            var reporterId = userIds[reporterIdx];
            var targetGroupId = groupIds[i];
            var reason = reportReasons[random.Next(reportReasons.Length)];
            var ts = now.AddDays(-random.Next(1, 10));

            await db.Database.ExecuteSqlInterpolatedAsync(
                $@"INSERT INTO ""Reports"" (""ReporterId"", ""ReportType"", ""PostId"", ""ReelId"", ""UserId"", ""GroupId"",
                    ""Reason"", ""Details"", ""Status"", ""ReviewedByUserId"", ""ReviewedAt"", ""ReviewNote"",
                    ""CreatedAt"", ""UpdatedAt"", ""DeletedAt"")
                 VALUES ({reporterId}, {(byte)ReportType.Group}, NULL, NULL, NULL, {targetGroupId},
                         {reason}, {"Group violating community guidelines."}, {(byte)ReportStatus.Pending},
                         NULL, NULL, NULL, {ts}, NULL, NULL)");
        }

        // Reports for reels (3 reports)
        for (int i = 0; i < 3; i++)
        {
            if (i >= reelIds.Count) break;
            var reporterIdx = random.Next(userIds.Count);
            var reporterId = userIds[reporterIdx];
            var targetReelId = reelIds[i];
            var reason = reportReasons[random.Next(reportReasons.Length)];
            var status = (byte)(i % 2 == 0 ? ReportStatus.Pending : ReportStatus.Reviewed);
            var ts = now.AddDays(-random.Next(1, 20));
            var reviewNote = status == (byte)ReportStatus.Reviewed ? "Inappropriate reel content reviewed." : (string?)null;
            var reviewedBy = status != (byte)ReportStatus.Pending ? userIds[0] : (Guid?)null;
            var reviewedAt = status != (byte)ReportStatus.Pending ? ts.AddDays(1) : (DateTime?)null;

            await db.Database.ExecuteSqlInterpolatedAsync(
                $@"INSERT INTO ""Reports"" (""ReporterId"", ""ReportType"", ""PostId"", ""ReelId"", ""UserId"", ""GroupId"",
                    ""Reason"", ""Details"", ""Status"", ""ReviewedByUserId"", ""ReviewedAt"", ""ReviewNote"",
                    ""CreatedAt"", ""UpdatedAt"", ""DeletedAt"")
                 VALUES ({reporterId}, {(byte)ReportType.Reel}, NULL, {targetReelId}, NULL, NULL,
                         {reason}, {"Reel reported for guideline violation."}, {status},
                         {reviewedBy}, {reviewedAt}, {reviewNote},
                         {ts}, NULL, NULL)");
        }

        logger.LogInformation("Seeded reports for posts, users, groups, and reels.");
    }

    /// <summary>Removes all test data seeded by this seeder. Call this before re-seeding.</summary>
    public static async Task ClearTestDataAsync(IServiceProvider serviceProvider)
    {
        var logger = serviceProvider.GetRequiredService<ILoggerFactory>()
            .CreateLogger("TestDataSeeder");

        await using var scope = serviceProvider.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var testEmails = TestUsers.Select(u => u.Email).ToList();

        await db.Database.ExecuteSqlRawAsync(
            @"DELETE FROM ""Reports"" WHERE ""ReporterId"" IN (
                  SELECT ""Id"" FROM ""AspNetUsers"" WHERE ""Email"" NOT IN ({0})
              )", RoleSeeder.AdminEmail);

        await db.Database.ExecuteSqlRawAsync(
            @"DELETE FROM ""Reels"" WHERE ""AuthorId"" IN (
                  SELECT ""Id"" FROM ""AspNetUsers"" WHERE ""Email"" NOT IN ({0})
              )", RoleSeeder.AdminEmail);

        await db.Database.ExecuteSqlRawAsync(
            @"DELETE FROM ""PostComments"" WHERE ""UserId"" IN (
                  SELECT ""Id"" FROM ""AspNetUsers"" WHERE ""Email"" NOT IN ({0})
              )", RoleSeeder.AdminEmail);

        await db.Database.ExecuteSqlRawAsync(
            @"DELETE FROM ""Posts"" WHERE ""AuthorId"" IN (
                  SELECT ""Id"" FROM ""AspNetUsers"" WHERE ""Email"" NOT IN ({0})
              )", RoleSeeder.AdminEmail);

        await db.Database.ExecuteSqlRawAsync(
            @"DELETE FROM ""GroupMembers"" WHERE ""UserId"" IN (
                  SELECT ""Id"" FROM ""AspNetUsers"" WHERE ""Email"" NOT IN ({0})
              )", RoleSeeder.AdminEmail);

        await db.Database.ExecuteSqlRawAsync(
            @"DELETE FROM ""Groups"" WHERE ""OwnerUserId"" IN (
                  SELECT ""Id"" FROM ""AspNetUsers"" WHERE ""Email"" NOT IN ({0})
              )", RoleSeeder.AdminEmail);

        await db.Database.ExecuteSqlRawAsync(
            @"DELETE FROM ""AspNetUserLogins"" WHERE ""UserId"" IN (
                  SELECT ""Id"" FROM ""AspNetUsers"" WHERE ""Email"" NOT IN ({0})
              )", RoleSeeder.AdminEmail);

        await db.Database.ExecuteSqlRawAsync(
            @"DELETE FROM ""AspNetUserTokens"" WHERE ""UserId"" IN (
                  SELECT ""Id"" FROM ""AspNetUsers"" WHERE ""Email"" NOT IN ({0})
              )", RoleSeeder.AdminEmail);

        await db.Database.ExecuteSqlRawAsync(
            @"DELETE FROM ""AspNetUserRoles"" WHERE ""UserId"" IN (
                  SELECT ""Id"" FROM ""AspNetUsers"" WHERE ""Email"" NOT IN ({0})
              )", RoleSeeder.AdminEmail);

        await db.Database.ExecuteSqlRawAsync(
            @"DELETE FROM ""AspNetUsers"" WHERE ""Email"" NOT IN ({0})", RoleSeeder.AdminEmail);

        logger.LogInformation("Cleared all test data.");
    }
}
