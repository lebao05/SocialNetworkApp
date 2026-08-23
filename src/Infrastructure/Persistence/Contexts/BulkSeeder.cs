using Domain.Entities;
using Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Persistence.Contexts;

/// <summary>
/// Seeds 100 users with friendships, groups, group members, and group rules.
/// Focus user: lgbaowork05@gmail.com
/// </summary>
public static class BulkSeeder
{
    private const string FocusEmail = "lgbaowork05@gmail.com";
    private const string FocusPassword = "Demo@123";
    private const string DefaultPassword = "Demo@123";

    private static readonly string[] FirstNames =
    [
        "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
        "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
        "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
        "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
        "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
        "Kenneth", "Dorothy", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa",
        "Timothy", "Deborah", "Ronald", "Stephanie", "Edward", "Rebecca", "Jason", "Sharon",
        "Jeffrey", "Laura", "Ryan", "Cynthia", "Jacob", "Kathleen", "Gary", "Amy",
        "Nicholas", "Angela", "Eric", "Shirley", "Jonathan", "Anna", "Stephen", "Brenda",
        "Larry", "Pamela", "Justin", "Emma", "Scott", "Nicole", "Brandon", "Helen",
        "Benjamin", "Samantha", "Samuel", "Katherine", "Raymond", "Christine", "Gregory", "Debra",
        "Frank", "Rachel", "Alexander", "Carolyn", "Patrick", "Janet", "Jack", "Catherine",
        "Dennis", "Maria", "Jerry", "Heather"
    ];

    private static readonly string[] LastNames =
    [
        "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
        "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
        "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
        "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young",
        "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
        "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
        "Carter", "Roberts", "Turner", "Phillips", "Evans", "Parker", "Collins", "Edwards"
    ];

    private static readonly string[] GroupNames =
    [
        "Tech Enthusiasts", "Photography Club", "Book Lovers", "Fitness & Health",
        "Game Dev Central", "Music Production", "Travel Adventures", "Food & Cooking",
        "Art & Design", "Movie Buffs", "Sports Fans", "Science & Tech",
        "Entrepreneurs Hub", "Startup Founders", "Digital Marketing", "Data Science",
        "Web Developers", "Mobile App Dev", "AI & Machine Learning", "Cybersecurity",
        "Gaming Community", "Esports League", "Music Lovers", "Movie Critics",
        "Book Worms", "Fitness Motivation", "Yoga & Meditation", "Hiking Club",
        "Pet Lovers", "Parenting Tips"
    ];

    private static readonly string[] GroupDescriptions =
    [
        "A community for tech lovers to share and discuss the latest in technology.",
        "Share your photos, get feedback, and learn from fellow photographers.",
        "For those who can't put down a good book. Reviews and recommendations.",
        "Motivation, tips, and support for your fitness journey.",
        "Indie and AAA game developers sharing knowledge and projects.",
        "For music producers and beatmakers to collaborate.",
        "Share your travel experiences and discover new destinations.",
        "Recipes, cooking tips, and food photography.",
        "Artists and designers sharing their work and getting feedback.",
        "Movie reviews, discussions, and recommendations.",
        "For sports enthusiasts to discuss games and teams.",
        "Exploring the wonders of science and technology.",
        "Connect with entrepreneurs and share startup experiences.",
        "Founders sharing insights and supporting each other.",
        "Tips and strategies for digital marketing campaigns.",
        "Data scientists sharing knowledge and projects.",
        "Web developers collaborating and sharing resources.",
        "Mobile app developers for iOS and Android.",
        "AI and ML enthusiasts discussing latest trends.",
        "Cybersecurity professionals and enthusiasts.",
        "Gaming community for all types of games.",
        "Competitive gaming league and tournament organization.",
        "Music lovers sharing playlists and discussing artists.",
        "In-depth movie analysis and critique discussions.",
        "For avid readers to share and discuss books.",
        "Daily motivation and fitness tips.",
        "Yoga practitioners and meditation enthusiasts.",
        "Hikers sharing trails and organizing trips.",
        "Pet owners sharing cute moments and advice.",
        "Parents sharing experiences and tips."
    ];

    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        var logger = serviceProvider.GetRequiredService<ILoggerFactory>()
            .CreateLogger("BulkSeeder");

        logger.LogInformation("BulkSeeder starting...");

        await using var scope = serviceProvider.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

        var now = DateTime.UtcNow;
        var random = new Random(123); // deterministic

        // ── 1. Create focus user FIRST ────────────────────────────────────────
        var focusUser = await userManager.FindByEmailAsync(FocusEmail);
        if (focusUser == null)
        {
            focusUser = new User("Lam", "Bao", new DateOnly(1995, 5, 15), Gender.Male, FocusEmail);
            var result = await userManager.CreateAsync(focusUser, FocusPassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(focusUser, "USER");
                logger.LogInformation("Created focus user {Email} ({Id})", FocusEmail, focusUser.Id);
            }
            else
            {
                logger.LogWarning("Failed to create focus user: {Errors}",
                    string.Join(", ", result.Errors.Select(e => e.Description)));
                return;
            }
        }
        else
        {
            logger.LogInformation("Focus user {Email} already exists ({Id})", FocusEmail, focusUser.Id);
        }

        // ── 2. Check existing users and create 99 more ───────────────────────
        var existingCount = await db.Users.CountAsync(u => u.Email != RoleSeeder.AdminEmail && u.Email != FocusEmail);
        var usersToCreate = 99 - existingCount;

        if (usersToCreate > 0)
        {
            logger.LogInformation("Creating {Count} additional users...", usersToCreate);
            var newUserIds = new List<Guid> { focusUser.Id };

            for (int i = 0; i < usersToCreate; i++)
            {
                var firstName = FirstNames[random.Next(FirstNames.Length)];
                var lastName = LastNames[random.Next(LastNames.Length)];
                var email = $"{firstName.ToLower()}.{lastName.ToLower()}{i}@demo.com";
                var dob = DateOnly.FromDateTime(now.AddYears(-random.Next(18, 65)).AddDays(-random.Next(0, 365)));
                var gender = (Gender)random.Next(0, 2);

                var existingUser = await userManager.FindByEmailAsync(email);
                if (existingUser != null)
                {
                    newUserIds.Add(existingUser.Id);
                    continue;
                }

                var user = new User(firstName, lastName, dob, gender, email);
                var result = await userManager.CreateAsync(user, DefaultPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "USER");
                    newUserIds.Add(user.Id);
                    logger.LogInformation("Created user {Email} ({Id})", email, user.Id);
                }
            }

            logger.LogInformation("User creation phase complete.");
        }

        // ── 3. Get ALL user IDs ──────────────────────────────────────────────
        var allUserIds = await db.Users
            .Where(u => u.Email != RoleSeeder.AdminEmail)
            .Select(u => u.Id)
            .ToListAsync();

        if (allUserIds.Count < 10)
        {
            logger.LogWarning("Not enough users for seeding. Need at least 10 users.");
            return;
        }

        // Update stagger dates for all users
        var staggerDays = 90;
        for (int i = 0; i < allUserIds.Count; i++)
        {
            var staggerDate = now.AddDays(-staggerDays + (i * (staggerDays / allUserIds.Count)) + random.Next(0, 5));
            await db.Database.ExecuteSqlInterpolatedAsync(
                $"UPDATE \"AspNetUsers\" SET \"CreatedAt\" = {staggerDate.ToUniversalTime()} WHERE \"Id\" = {allUserIds[i]}");
        }
        logger.LogInformation("Updated CreatedAt for {Count} users.", allUserIds.Count);

        // ── 4. Seed FRIENDSHIPS (20-30 per user) ─────────────────────────────
        await SeedFriendshipsAsync(db, logger, allUserIds, now, random);

        // ── 5. Seed GROUPS ───────────────────────────────────────────────────
        var groupIds = await SeedGroupsAsync(db, logger, allUserIds, now, random);

        // ── 6. Seed GROUP MEMBERS ─────────────────────────────────────────────
        await SeedGroupMembersAsync(db, logger, focusUser.Id, allUserIds, groupIds, now, random);

        // ── 7. Seed GROUP RULES ───────────────────────────────────────────────
        await SeedGroupRulesAsync(db, logger, groupIds);

        logger.LogInformation("BulkSeeder finished successfully!");
    }

    private static async Task SeedFriendshipsAsync(AppDbContext db, ILogger logger, List<Guid> allUserIds, DateTime now, Random random)
    {
        logger.LogInformation("Seeding friendships...");

        // Check existing friendships
        var existingFriendships = await db.Friendships.CountAsync();
        if (existingFriendships > 100)
        {
            logger.LogInformation("Friendships already exist ({Count}). Skipping.", existingFriendships);
            return;
        }

        // Delete existing friendships first for clean slate
        await db.Database.ExecuteSqlRawAsync(@"DELETE FROM ""Friendships""");
        logger.LogInformation("Cleared existing friendships.");

        var friendshipId = 1L;
        var friendshipSet = new HashSet<(Guid, Guid)>();

        foreach (var userId in allUserIds)
        {
            // Target: 20-30 friends per user
            var friendCount = random.Next(20, 31);
            var attempts = 0;

            while (friendshipSet.Count(f => f.Item1 == userId || f.Item2 == userId) < friendCount && attempts < 100)
            {
                var friendId = allUserIds[random.Next(allUserIds.Count)];
                if (friendId == userId) { attempts++; continue; }

                // Ensure IDs are sorted (Friendship convention)
                var (id1, id2) = userId.CompareTo(friendId) < 0 ? (userId, friendId) : (friendId, userId);

                if (friendshipSet.Add((id1, id2)))
                {
                    var createdAt = now.AddDays(-random.Next(1, 90));
                    await db.Database.ExecuteSqlInterpolatedAsync(
                        $@"INSERT INTO ""Friendships"" (""User1Id"", ""User2Id"", ""CreatedAt"", ""UpdatedAt"", ""DeletedAt"")
                         VALUES ({id1}, {id2}, {createdAt.ToUniversalTime()}, NULL, NULL)");
                    friendshipId++;
                }
                attempts++;
            }
        }

        logger.LogInformation("Seeded {Count} friendships.", friendshipId - 1);
    }

    private static async Task<List<long>> SeedGroupsAsync(AppDbContext db, ILogger logger, List<Guid> allUserIds, DateTime now, Random random)
    {
        logger.LogInformation("Seeding groups...");

        // Clear existing groups for clean slate - must delete in correct order due to FK constraints
        // 1. Clear Reports first (removes all FK references)
        await db.Database.ExecuteSqlRawAsync(@"DELETE FROM ""Reports""");
        // 2. Delete GroupRules
        await db.Database.ExecuteSqlRawAsync(@"DELETE FROM ""GroupRules""");
        // 3. Delete GroupMembers
        await db.Database.ExecuteSqlRawAsync(@"DELETE FROM ""GroupMembers""");
        // 4. Delete Groups
        await db.Database.ExecuteSqlRawAsync(@"DELETE FROM ""Groups""");
        logger.LogInformation("Cleared existing groups and related data.");

        var groupIds = new List<long>();
        var groupId = 1L;

        // Create 20 groups
        for (int i = 0; i < 20 && i < GroupNames.Length; i++)
        {
            var ownerIdx = random.Next(allUserIds.Count);
            var ownerId = allUserIds[ownerIdx];
            var privacy = (GroupPrivacyType)random.Next(0, 2);
            var createdAt = now.AddDays(-random.Next(10, 90));

            await db.Database.ExecuteSqlInterpolatedAsync(
                $@"INSERT INTO ""Groups"" (""GroupId"", ""OwnerUserId"", ""Name"", ""Description"", ""PrivacyType"",
                    ""CoverPhotoUrl"", ""IsPostApprovalRequired"", ""IsGroupJoinApprovalRequired"",
                    ""AllowAnonymousPost"", ""IsLocked"", ""CreatedAt"", ""UpdatedAt"", ""DeletedAt"")
                 VALUES ({groupId}, {ownerId}, {GroupNames[i]}, {GroupDescriptions[i]}, {(byte)privacy},
                         NULL, {random.Next(2) == 0}, {privacy == GroupPrivacyType.Private}, {random.Next(3) == 0},
                         false, {createdAt.ToUniversalTime()}, NULL, NULL)");

            groupIds.Add(groupId);
            groupId++;
        }

        logger.LogInformation("Seeded {Count} groups.", groupIds.Count);
        return groupIds;
    }

    private static async Task SeedGroupMembersAsync(AppDbContext db, ILogger logger, Guid focusUserId, List<Guid> allUserIds, List<long> groupIds, DateTime now, Random random)
    {
        logger.LogInformation("Seeding group members...");

        var gmId = 1L;

        foreach (var groupId in groupIds)
        {
            // Get group owner
            var ownerId = await db.Groups.Where(g => g.Id == groupId).Select(g => g.OwnerUserId).FirstOrDefaultAsync();

            // Add owner as first member
            var joinedAt = now.AddDays(-random.Next(30, 90));
            await db.Database.ExecuteSqlInterpolatedAsync(
                $@"INSERT INTO ""GroupMembers"" (""GroupMemberId"", ""GroupId"", ""UserId"", ""Role"",
                    ""JoinedAt"", ""ApprovedAt"", ""DeletedAt"")
                 VALUES ({gmId}, {groupId}, {ownerId}, {(byte)GroupMemberRole.Admin},
                         {joinedAt}, {joinedAt.AddDays(1)}, NULL)");
            gmId++;

            // Add focus user to FIRST 10 groups as Admin (make them visible in demo)
            if (groupId <= 10 && !await db.GroupMembers.AnyAsync(gm => gm.GroupId == groupId && gm.UserId == focusUserId))
            {
                await db.Database.ExecuteSqlInterpolatedAsync(
                    $@"INSERT INTO ""GroupMembers"" (""GroupMemberId"", ""GroupId"", ""UserId"", ""Role"",
                        ""JoinedAt"", ""ApprovedAt"", ""DeletedAt"")
                     VALUES ({gmId}, {groupId}, {focusUserId}, {(byte)(groupId <= 5 ? GroupMemberRole.Admin : GroupMemberRole.Member)},
                             {now.AddDays(-random.Next(5, 60))}, {now.AddDays(-random.Next(1, 30))}, NULL)");
                gmId++;
            }

            // Add 10-30 random members per group
            var memberCount = random.Next(10, 31);
            var shuffled = allUserIds.OrderBy(_ => random.Next()).Take(memberCount + 20).ToList();

            foreach (var userId in shuffled.Take(memberCount))
            {
                if (userId == ownerId || userId == focusUserId) continue;

                var isAlreadyMember = await db.GroupMembers.AnyAsync(gm => gm.GroupId == groupId && gm.UserId == userId);
                if (isAlreadyMember) continue;

                joinedAt = now.AddDays(-random.Next(1, 60));
                var role = (GroupMemberRole)random.Next(0, 3);

                await db.Database.ExecuteSqlInterpolatedAsync(
                    $@"INSERT INTO ""GroupMembers"" (""GroupMemberId"", ""GroupId"", ""UserId"", ""Role"",
                        ""JoinedAt"", ""ApprovedAt"", ""DeletedAt"")
                     VALUES ({gmId}, {groupId}, {userId}, {(byte)role},
                             {joinedAt}, {joinedAt.AddDays(random.Next(0, 5))}, NULL)");
                gmId++;
            }
        }

        logger.LogInformation("Seeded {Count} group members.", gmId - 1);
    }

    private static async Task SeedGroupRulesAsync(AppDbContext db, ILogger logger, List<long> groupIds)
    {
        logger.LogInformation("Seeding group rules...");

        var ruleId = 1L;
        var ruleTemplates = new[]
        {
            ("Be Respectful", "Treat all members with respect. No harassment, hate speech, or personal attacks."),
            ("No Spam", "Don't post repetitive content or promote external websites without permission."),
            ("Stay on Topic", "Keep discussions relevant to the group's theme and purpose."),
            ("No NSFW Content", "Content must be appropriate for all audiences. No adult content."),
            ("English Only", "Please use English in all posts and comments for community understanding."),
            ("No Self-Promotion", "Don't promote your own products or services without moderator approval."),
            ("Protect Privacy", "Don't share personal information of yourself or others without consent."),
            ("Report Issues", "If you see something inappropriate, report it to the moderators."),
            ("Follow Community Guidelines", "All members must follow the platform's terms of service."),
            (" constructive Criticism", "Give feedback in a constructive and helpful manner.")
        };

        foreach (var groupId in groupIds)
        {
            // Add 2-4 rules per group
            var rulesToAdd = random.Next(2, 5);
            var shuffledRules = ruleTemplates.OrderBy(_ => random.Next()).Take(rulesToAdd);

            foreach (var (title, description) in shuffledRules)
            {
                await db.Database.ExecuteSqlInterpolatedAsync(
                    $@"INSERT INTO ""GroupRules"" (""GroupRuleId"", ""GroupId"", ""Title"", ""Description"",
                        ""CreatedAt"", ""UpdatedAt"", ""DeletedAt"")
                     VALUES ({ruleId}, {groupId}, {title}, {description},
                             {DateTime.UtcNow}, NULL, NULL)");
                ruleId++;
            }
        }

        logger.LogInformation("Seeded {Count} group rules.", ruleId - 1);
    }

    private static Random random = new(123);

    /// <summary>Removes all bulk-seeded data.</summary>
    public static async Task SeedGroupsOnlyAsync(IServiceProvider serviceProvider)
    {
        var logger = serviceProvider.GetRequiredService<ILoggerFactory>()
            .CreateLogger("BulkSeeder");

        await using var scope = serviceProvider.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var now = DateTime.UtcNow;
        var random = new Random(42); // Fixed seed for reproducibility

        // Get focus user
        var focusUser = await db.Users.FirstOrDefaultAsync(u => u.Email == "lgbaowork05@gmail.com");
        if (focusUser == null)
        {
            logger.LogWarning("Focus user lgbaowork05@gmail.com not found. Cannot seed groups.");
            return;
        }

        // Get all user IDs
        var allUserIds = await db.Users.Select(u => u.Id).ToListAsync();

        // Clear existing groups
        await db.Database.ExecuteSqlRawAsync(@"DELETE FROM ""Reports""");
        await db.Database.ExecuteSqlRawAsync(@"DELETE FROM ""GroupRules""");
        await db.Database.ExecuteSqlRawAsync(@"DELETE FROM ""GroupMembers""");
        await db.Database.ExecuteSqlRawAsync(@"DELETE FROM ""Groups""");
        logger.LogInformation("Cleared existing groups.");

        // Create 20 groups
        var groupIds = new List<long>();
        var groupId = 1L;

        for (int i = 0; i < 20 && i < GroupNames.Length; i++)
        {
            var ownerIdx = random.Next(allUserIds.Count);
            var ownerId = allUserIds[ownerIdx];
            var privacy = (GroupPrivacyType)random.Next(0, 2);
            var createdAt = now.AddDays(-random.Next(10, 90));

            await db.Database.ExecuteSqlInterpolatedAsync(
                $@"INSERT INTO ""Groups"" (""GroupId"", ""OwnerUserId"", ""Name"", ""Description"", ""PrivacyType"",
                    ""CoverPhotoUrl"", ""IsPostApprovalRequired"", ""IsGroupJoinApprovalRequired"", ""AllowAnonymousPost"",
                    ""CreatedAt"", ""UpdatedAt"", ""DeletedAt"")
                 VALUES ({groupId}, {ownerId}, {GroupNames[i]}, {GroupDescriptions[i]}, {(byte)privacy},
                         {null}, {random.Next(2) == 0}, {random.Next(2) == 0}, {random.Next(2) == 0},
                         {createdAt.ToUniversalTime()}, NULL, NULL)");
            groupIds.Add(groupId);
            groupId++;
        }
        logger.LogInformation("Created {Count} groups.", groupIds.Count);

        // Seed group members
        var gmId = 1L;
        foreach (var gid in groupIds)
        {
            var ownerId = await db.Groups.Where(g => g.Id == gid).Select(g => g.OwnerUserId).FirstOrDefaultAsync();
            var joinedAt = now.AddDays(-random.Next(30, 90));

            // Add owner
            await db.Database.ExecuteSqlInterpolatedAsync(
                $@"INSERT INTO ""GroupMembers"" (""GroupMemberId"", ""GroupId"", ""UserId"", ""Role"",
                    ""CreatedAt"", ""UpdatedAt"", ""DeletedAt"")
                 VALUES ({gmId}, {gid}, {ownerId}, {(byte)GroupMemberRole.Admin},
                         {joinedAt}, NULL, NULL)");
            gmId++;

            // Add focus user to first 10 groups
            if (gid <= 10)
            {
                await db.Database.ExecuteSqlInterpolatedAsync(
                    $@"INSERT INTO ""GroupMembers"" (""GroupMemberId"", ""GroupId"", ""UserId"", ""Role"",
                        ""CreatedAt"", ""UpdatedAt"", ""DeletedAt"")
                     VALUES ({gmId}, {gid}, {focusUser.Id}, {(byte)GroupMemberRole.Admin},
                             {now.AddDays(-random.Next(5, 60))}, NULL, NULL)");
                gmId++;
            }

            // Add random members
            var shuffled = allUserIds.OrderBy(_ => random.Next()).Take(20).ToList();
            foreach (var userId in shuffled.Take(15))
            {
                if (userId == ownerId || userId == focusUser.Id) continue;
                joinedAt = now.AddDays(-random.Next(1, 60));
                await db.Database.ExecuteSqlInterpolatedAsync(
                    $@"INSERT INTO ""GroupMembers"" (""GroupMemberId"", ""GroupId"", ""UserId"", ""Role"",
                        ""CreatedAt"", ""UpdatedAt"", ""DeletedAt"")
                     VALUES ({gmId}, {gid}, {userId}, {(byte)GroupMemberRole.Member},
                             {joinedAt}, NULL, NULL)");
                gmId++;
            }
        }
        logger.LogInformation("Seeded {Count} group members.", gmId - 1);

        // Seed group rules
        var ruleId = 1L;
        var ruleTemplates = new[]
        {
            ("Be Respectful", "Treat all members with respect."),
            ("No Spam", "Don't post repetitive content."),
            ("Stay on Topic", "Keep discussions relevant."),
            ("No NSFW", "Content must be appropriate."),
        };

        foreach (var gid in groupIds)
        {
            var shuffledRules = ruleTemplates.OrderBy(_ => random.Next()).Take(3);
            foreach (var (title, description) in shuffledRules)
            {
                await db.Database.ExecuteSqlInterpolatedAsync(
                    $@"INSERT INTO ""GroupRules"" (""GroupRuleId"", ""GroupId"", ""Title"", ""Description"",
                        ""CreatedAt"", ""UpdatedAt"", ""DeletedAt"")
                     VALUES ({ruleId}, {gid}, {title}, {description},
                             {DateTime.UtcNow}, NULL, NULL)");
                ruleId++;
            }
        }
        logger.LogInformation("Seeded {Count} group rules.", ruleId - 1);

        logger.LogInformation("Groups seeding completed!");
    }

    public static async Task ClearBulkDataAsync(IServiceProvider serviceProvider)
    {
        var logger = serviceProvider.GetRequiredService<ILoggerFactory>()
            .CreateLogger("BulkSeeder");

        await using var scope = serviceProvider.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        await db.Database.ExecuteSqlRawAsync(@"DELETE FROM ""GroupRules""");
        await db.Database.ExecuteSqlRawAsync(@"DELETE FROM ""GroupMembers""");
        await db.Database.ExecuteSqlRawAsync(@"DELETE FROM ""Groups""");
        await db.Database.ExecuteSqlRawAsync(@"DELETE FROM ""Friendships""");

        logger.LogInformation("Cleared all bulk-seeded data.");
    }

    /// <summary>Seeds posts with comments and reactions for all users.</summary>
    public static async Task SeedPostsOnlyAsync(IServiceProvider serviceProvider)
    {
        var logger = serviceProvider.GetRequiredService<ILoggerFactory>()
            .CreateLogger("BulkSeeder");

        await using var scope = serviceProvider.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var now = DateTime.UtcNow;
        var random = new Random(999);

        var focusUser = await db.Users.FirstOrDefaultAsync(u => u.Email == "lgbaowork05@gmail.com");
        if (focusUser == null)
        {
            logger.LogWarning("Focus user not found.");
            return;
        }

        var allUserIds = await db.Users.Select(u => u.Id).ToListAsync();

        // Clear existing post-related data first
        await db.Database.ExecuteSqlRawAsync(@"DELETE FROM ""PostReactions""");
        await db.Database.ExecuteSqlRawAsync(@"DELETE FROM ""PostComments""");
        await db.Database.ExecuteSqlRawAsync(@"DELETE FROM ""Posts""");
        logger.LogInformation("Cleared existing posts and related data.");

        var postIds = new List<long>();

        var postTemplates = new[]
        {
            "Just had an amazing day exploring the city!",
            "Working on something exciting, can't wait to share it.",
            "Beautiful weather today, perfect for a walk in the park.",
            "Anyone up for a coffee this weekend?",
            "Finished reading an incredible book, highly recommend it!",
            "Learning new things every day. Growth mindset!",
            "Weekend vibes are the best vibes.",
            "Grateful for all the wonderful people in my life.",
            "Just watched an amazing movie, what a great story!",
            "Coding late into the night, the grind never stops!",
            "Feeling inspired after attending a great event.",
            "Nature photography session was a success today!",
            "Cooking a new recipe, smells delicious already.",
            "Travel plans are coming together nicely.",
            "Sometimes you just need to take a break and relax."
        };

        // Build posts batch SQL
        var postValues = new List<string>();
        foreach (var userId in allUserIds)
        {
            var postCount = random.Next(2, 6);
            for (int i = 0; i < postCount; i++)
            {
                var postId = postIds.Count + 1;
                var visibility = (Domain.Enums.PostVisibility)random.Next(0, 4);
                var createdAt = now.AddDays(-random.Next(1, 30));
                var content = postTemplates[random.Next(postTemplates.Length)].Replace("'", "''");

                postValues.Add($"({postId}, '{userId}', NULL, E'{content}', {(byte)visibility}, NULL, NULL, '{createdAt:yyyy-MM-dd HH:mm:ss}', NULL, NULL, {(byte)Domain.Enums.PostApprovalStatus.Approved}, false, NULL, NULL, false)");
                postIds.Add(postId);
            }
        }

        // Insert posts in batches of 50
        for (int i = 0; i < postValues.Count; i += 50)
        {
            var batch = postValues.Skip(i).Take(50);
            var sql = $@"INSERT INTO ""Posts"" (""PostId"", ""AuthorId"", ""GroupId"", ""Content"", ""Visibility"", ""LocationTag"", ""FeelingActivity"", ""CreatedAt"", ""UpdatedAt"", ""DeletedAt"", ""ApprovalStatus"", ""IsHiddenFromGroup"", ""HiddenAt"", ""HideReason"", ""IsAnonymous"") VALUES {string.Join(",", batch)}";
            await db.Database.ExecuteSqlRawAsync(sql);
        }
        logger.LogInformation("Created {Count} posts for all users.", postIds.Count);

        // Build comments batch SQL
        var commentValues = new List<string>();
        var commentTemplates = new[]
        {
            "This is awesome!",
            "Love it!",
            "Great post, thanks for sharing!",
            "I totally agree with this.",
            "This is so relatable.",
            "Amazing!",
            "Can't wait to try this myself!",
            "Inspiring as always!"
        };

        foreach (var postId in postIds)
        {
            var commentCount = random.Next(3, 9);
            var commenters = allUserIds.OrderBy(_ => random.Next()).Take(commentCount).ToList();
            var commentId = commentValues.Count + 1;

            foreach (var commenterId in commenters)
            {
                var content = commentTemplates[random.Next(commentTemplates.Length)].Replace("'", "''");
                var createdAt = now.AddDays(-random.Next(0, 20));
                commentValues.Add($"({commentId}, {postId}, '{commenterId}', NULL, NULL, E'{content}', '{createdAt:yyyy-MM-dd HH:mm:ss}', NULL, NULL)");
                commentId++;
            }
        }

        // Insert comments in batches of 100
        for (int i = 0; i < commentValues.Count; i += 100)
        {
            var batch = commentValues.Skip(i).Take(100);
            var sql = $@"INSERT INTO ""PostComments"" (""CommentId"", ""PostId"", ""UserId"", ""ParentCommentId"", ""RepliedUserId"", ""Content"", ""CreatedAt"", ""UpdatedAt"", ""DeletedAt"") VALUES {string.Join(",", batch)}";
            await db.Database.ExecuteSqlRawAsync(sql);
        }
        logger.LogInformation("Created {Count} post comments.", commentValues.Count);

        // Build reactions batch SQL
        var reactionValues = new List<string>();
        var reactionTypes = new[] { 0, 1, 2, 3, 4, 5 };

        foreach (var postId in postIds)
        {
            var reactorCount = random.Next(5, 16);
            var reactors = allUserIds.OrderBy(_ => random.Next()).Take(reactorCount).ToList();
            var reactionId = reactionValues.Count + 1;

            foreach (var reactorId in reactors)
            {
                var createdAt = now.AddDays(-random.Next(0, 15));
                reactionValues.Add($"({reactionId}, '{reactorId}', {postId}, {(short)reactionTypes[random.Next(reactionTypes.Length)]}, '{createdAt:yyyy-MM-dd HH:mm:ss}')");
                reactionId++;
            }
        }

        // Insert reactions in batches of 100
        for (int i = 0; i < reactionValues.Count; i += 100)
        {
            var batch = reactionValues.Skip(i).Take(100);
            var sql = $@"INSERT INTO ""PostReactions"" (""ReactionId"", ""UserId"", ""PostId"", ""ReactionType"", ""CreatedAt"") VALUES {string.Join(",", batch)}";
            await db.Database.ExecuteSqlRawAsync(sql);
        }
        logger.LogInformation("Created {Count} post reactions.", reactionValues.Count);

        logger.LogInformation("Posts seeding completed!");
    }

    /// <summary>Seeds reels with comments and reactions for all users.</summary>
    public static async Task SeedReelsOnlyAsync(IServiceProvider serviceProvider)
    {
        var logger = serviceProvider.GetRequiredService<ILoggerFactory>()
            .CreateLogger("BulkSeeder");

        await using var scope = serviceProvider.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var now = DateTime.UtcNow;
        var random = new Random(888);

        var focusUser = await db.Users.FirstOrDefaultAsync(u => u.Email == "lgbaowork05@gmail.com");
        if (focusUser == null)
        {
            logger.LogWarning("Focus user not found.");
            return;
        }

        var allUserIds = await db.Users.Select(u => u.Id).ToListAsync();

        // Clear existing reel-related data first
        await db.Database.ExecuteSqlRawAsync(@"DELETE FROM ""ReelReactions""");
        await db.Database.ExecuteSqlRawAsync(@"DELETE FROM ""ReelComments""");
        await db.Database.ExecuteSqlRawAsync(@"DELETE FROM ""Reels""");
        logger.LogInformation("Cleared existing reels and related data.");

        var reelIds = new List<long>();

        var captionTemplates = new[]
        {
            "Check out this cool video! #trending",
            "Day in my life vlog part 1",
            "Quick tutorial on something cool",
            "Behind the scenes of my latest project",
            "This made me laugh so hard",
            "Learning new skills every day",
            "Travel vlog: Amazing places to visit",
            "Cooking challenge: Can I make this dish?",
            "Gym motivation to start your week right",
            "Music practice session",
            "Unboxing something exciting!",
            "My thoughts on today's event",
            "Nature is so beautiful this time of year",
            "Late night coding session vibes",
            "Weekend adventures with friends"
        };

        var videoUrls = new[]
        {
            "https://example.com/videos/reel1.mp4",
            "https://example.com/videos/reel2.mp4",
            "https://example.com/videos/reel3.mp4",
            "https://example.com/videos/reel4.mp4",
            "https://example.com/videos/reel5.mp4"
        };

        // Build reels batch SQL
        var reelValues = new List<string>();
        foreach (var userId in allUserIds)
        {
            var reelCount = random.Next(2, 6);
            for (int i = 0; i < reelCount; i++)
            {
                var reelId = reelIds.Count + 1;
                var visibility = (Domain.Enums.ReelVisibility)random.Next(0, 3);
                var createdAt = now.AddDays(-random.Next(1, 20));
                var caption = captionTemplates[random.Next(captionTemplates.Length)].Replace("'", "''");
                var videoUrl = videoUrls[random.Next(videoUrls.Length)];

                reelValues.Add($"({reelId}, '{userId}', '{videoUrl}', NULL, E'{caption}', NULL, '{random.Next(15, 61)}s', {(byte)visibility}, {random.Next(10, 1000)}, '{createdAt:yyyy-MM-dd HH:mm:ss}', NULL, NULL, false)");
                reelIds.Add(reelId);
            }
        }

        // Insert reels in batches of 50
        for (int i = 0; i < reelValues.Count; i += 50)
        {
            var batch = reelValues.Skip(i).Take(50);
            var sql = $@"INSERT INTO ""Reels"" (""ReelId"", ""AuthorId"", ""VideoUrl"", ""ThumbnailUrl"", ""Caption"", ""AudioTitle"", ""Duration"", ""Visibility"", ""ViewCount"", ""CreatedAt"", ""UpdatedAt"", ""DeletedAt"", ""IsLocked"") VALUES {string.Join(",", batch)}";
            await db.Database.ExecuteSqlRawAsync(sql);
        }
        logger.LogInformation("Created {Count} reels for all users.", reelIds.Count);

        // Build comments batch SQL
        var commentValues = new List<string>();
        var commentTemplates = new[]
        {
            "This is fire!",
            "Love this!",
            "So cool!",
            "Keep it up!",
            "This made my day better"
        };

        foreach (var reelId in reelIds)
        {
            var commentCount = random.Next(2, 6);
            var commenters = allUserIds.OrderBy(_ => random.Next()).Take(commentCount).ToList();
            var commentId = commentValues.Count + 1;

            foreach (var commenterId in commenters)
            {
                var content = commentTemplates[random.Next(commentTemplates.Length)].Replace("'", "''");
                var createdAt = now.AddDays(-random.Next(0, 10));
                commentValues.Add($"({commentId}, {reelId}, '{commenterId}', NULL, NULL, E'{content}', '{createdAt:yyyy-MM-dd HH:mm:ss}', NULL, NULL)");
                commentId++;
            }
        }

        // Insert comments in batches of 100
        for (int i = 0; i < commentValues.Count; i += 100)
        {
            var batch = commentValues.Skip(i).Take(100);
            var sql = $@"INSERT INTO ""ReelComments"" (""CommentId"", ""ReelId"", ""UserId"", ""ParentCommentId"", ""RepliedUserId"", ""Content"", ""CreatedAt"", ""UpdatedAt"", ""DeletedAt"") VALUES {string.Join(",", batch)}";
            await db.Database.ExecuteSqlRawAsync(sql);
        }
        logger.LogInformation("Created {Count} reel comments.", commentValues.Count);

        // Build reactions batch SQL
        var reactionValues = new List<string>();

        foreach (var reelId in reelIds)
        {
            var reactorCount = random.Next(5, 13);
            var reactors = allUserIds.OrderBy(_ => random.Next()).Take(reactorCount).ToList();
            var reactionId = reactionValues.Count + 1;

            foreach (var reactorId in reactors)
            {
                var createdAt = now.AddDays(-random.Next(0, 10));
                reactionValues.Add($"({reactionId}, '{reactorId}', {reelId}, '{createdAt:yyyy-MM-dd HH:mm:ss}')");
                reactionId++;
            }
        }

        // Insert reactions in batches of 100
        for (int i = 0; i < reactionValues.Count; i += 100)
        {
            var batch = reactionValues.Skip(i).Take(100);
            var sql = $@"INSERT INTO ""ReelReactions"" (""ReactionId"", ""UserId"", ""ReelId"", ""CreatedAt"") VALUES {string.Join(",", batch)}";
            await db.Database.ExecuteSqlRawAsync(sql);
        }
        logger.LogInformation("Created {Count} reel reactions.", reactionValues.Count);

        logger.LogInformation("Reels seeding completed!");
    }

    /// <summary>Seeds 3 posts per group with comments and reactions.</summary>
    public static async Task SeedGroupPostsAsync(IServiceProvider serviceProvider)
    {
        var logger = serviceProvider.GetRequiredService<ILoggerFactory>()
            .CreateLogger("BulkSeeder");

        await using var scope = serviceProvider.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var now = DateTime.UtcNow;
        var random = new Random(777);

        var focusUser = await db.Users.FirstOrDefaultAsync(u => u.Email == "lgbaowork05@gmail.com");
        if (focusUser == null)
        {
            logger.LogWarning("Focus user not found.");
            return;
        }

        var allUserIds = await db.Users.Select(u => u.Id).ToListAsync();
        var groupIds = await db.Groups.Select(g => g.Id).ToListAsync();

        if (groupIds.Count == 0)
        {
            logger.LogWarning("No groups found. Run seed-groups first.");
            return;
        }

        // Clear existing group posts and their related data
        var existingGroupPostIds = await db.Posts
            .Where(p => p.GroupId != null)
            .Select(p => p.Id)
            .ToListAsync();

        if (existingGroupPostIds.Count > 0)
        {
            await db.Database.ExecuteSqlRawAsync(@"DELETE FROM ""PostReactions"" WHERE ""PostId"" IN (SELECT ""PostId"" FROM ""Posts"" WHERE ""GroupId"" IS NOT NULL)");
            await db.Database.ExecuteSqlRawAsync(@"DELETE FROM ""PostComments"" WHERE ""PostId"" IN (SELECT ""PostId"" FROM ""Posts"" WHERE ""GroupId"" IS NOT NULL)");
            await db.Database.ExecuteSqlRawAsync(@"DELETE FROM ""Posts"" WHERE ""GroupId"" IS NOT NULL");
        }
        logger.LogInformation("Cleared existing group posts.");

        var postTemplates = new[]
        {
            "Welcome to the group! Let's make this a great community together!",
            "Just joined this group and already loving it. Who else is excited?",
            "Here's something I wanted to share with everyone here.",
            "Any tips for beginners? Would love to hear your suggestions!",
            "Happy to be part of this group! Looking forward to great discussions.",
            "Has anyone tried this before? Would love to hear your thoughts.",
            "Thought this might be helpful for the community.",
            "Let's keep this group active! Share what you're working on.",
            "Great to see so many passionate people here!",
            "Quick question for the group — any recommendations?"
        };

        var commentTemplates = new[]
        {
            "Love this!",
            "Great post!",
            "Thanks for sharing!",
            "Totally agree!",
            "Very helpful, thanks!",
            "Welcome to the group!",
            "Looking forward to more posts like this."
        };

        var postIds = new List<long>();
        var postValues = new List<string>();

        var basePostId = await db.Posts.AnyAsync()
            ? await db.Posts.MaxAsync(p => p.Id) + 1
            : 1L;

        foreach (var groupId in groupIds)
        {
            var groupMemberIds = await db.GroupMembers
                .Where(gm => gm.GroupId == groupId)
                .Select(gm => gm.UserId)
                .ToListAsync();

            if (groupMemberIds.Count == 0)
                groupMemberIds = allUserIds.OrderBy(_ => random.Next()).Take(5).ToList();

            var authors = groupMemberIds.OrderBy(_ => random.Next()).Take(3).ToList();

            for (int i = 0; i < 3; i++)
            {
                var postId = basePostId + postIds.Count;
                var authorId = authors[i % authors.Count];
                var content = postTemplates[random.Next(postTemplates.Length)].Replace("'", "''");
                var createdAt = now.AddDays(-random.Next(1, 30));

                postValues.Add($"({postId}, '{authorId}', {groupId}, E'{content}', {(byte)Domain.Enums.PostVisibility.Group}, NULL, NULL, '{createdAt:yyyy-MM-dd HH:mm:ss}', NULL, NULL, {(byte)Domain.Enums.PostApprovalStatus.Approved}, false, NULL, NULL, false)");
                postIds.Add(postId);
            }
        }

        // Insert posts in batches
        for (int i = 0; i < postValues.Count; i += 50)
        {
            var batch = postValues.Skip(i).Take(50);
            var sql = $@"INSERT INTO ""Posts"" (""PostId"", ""AuthorId"", ""GroupId"", ""Content"", ""Visibility"", ""LocationTag"", ""FeelingActivity"", ""CreatedAt"", ""UpdatedAt"", ""DeletedAt"", ""ApprovalStatus"", ""IsHiddenFromGroup"", ""HiddenAt"", ""HideReason"", ""IsAnonymous"") VALUES {string.Join(",", batch)}";
            await db.Database.ExecuteSqlRawAsync(sql);
        }
        logger.LogInformation("Created {Count} group posts ({PerGroup} per group).", postIds.Count, 3);

        // Build comments
        var commentValues = new List<string>();
        var baseCommentId = await db.PostComments.AnyAsync()
            ? await db.PostComments.MaxAsync(c => c.Id) + 1
            : 1;
        var commentId = baseCommentId;
        foreach (var postId in postIds)
        {
            var commenterCount = random.Next(2, 5);
            var commenters = allUserIds.OrderBy(_ => random.Next()).Take(commenterCount).ToList();
            foreach (var commenterId in commenters)
            {
                var content = commentTemplates[random.Next(commentTemplates.Length)].Replace("'", "''");
                var createdAt = now.AddDays(-random.Next(0, 20));
                commentValues.Add($"({commentId}, '{commenterId}', {postId}, NULL, NULL, E'{content}', '{createdAt:yyyy-MM-dd HH:mm:ss}', NULL, NULL)");
                commentId++;
            }
        }

        for (int i = 0; i < commentValues.Count; i += 100)
        {
            var batch = commentValues.Skip(i).Take(100);
            var sql = $@"INSERT INTO ""PostComments"" (""CommentId"", ""UserId"", ""PostId"", ""ParentCommentId"", ""RepliedUserId"", ""Content"", ""CreatedAt"", ""UpdatedAt"", ""DeletedAt"") VALUES {string.Join(",", batch)}";
            await db.Database.ExecuteSqlRawAsync(sql);
        }
        logger.LogInformation("Created {Count} group post comments.", commentValues.Count);

        // Build reactions
        var reactionValues = new List<string>();
        var baseReactionId = await db.PostReactions.AnyAsync()
            ? await db.PostReactions.MaxAsync(r => r.Id) + 1
            : 1;
        var reactionId = baseReactionId;
        foreach (var postId in postIds)
        {
            var reactorCount = random.Next(3, 8);
            var reactors = allUserIds.OrderBy(_ => random.Next()).Take(reactorCount).ToList();
            foreach (var reactorId in reactors)
            {
                var reactionType = (byte)random.Next(0, 7);
                var createdAt = now.AddDays(-random.Next(0, 15));
                reactionValues.Add($"({reactionId}, '{reactorId}', {postId}, {reactionType}, '{createdAt:yyyy-MM-dd HH:mm:ss}')");
                reactionId++;
            }
        }

        for (int i = 0; i < reactionValues.Count; i += 100)
        {
            var batch = reactionValues.Skip(i).Take(100);
            var sql = $@"INSERT INTO ""PostReactions"" (""ReactionId"", ""UserId"", ""PostId"", ""ReactionType"", ""CreatedAt"") VALUES {string.Join(",", batch)}";
            await db.Database.ExecuteSqlRawAsync(sql);
        }
        logger.LogInformation("Created {Count} group post reactions.", reactionValues.Count);

        logger.LogInformation("Group posts seeding completed!");
    }

    /// <summary>Assigns avatar and cover photos to users and groups via picsum.photos.</summary>
    public static async Task SeedUserAndGroupImagesAsync(IServiceProvider serviceProvider)
    {
        var logger = serviceProvider.GetRequiredService<ILoggerFactory>()
            .CreateLogger("BulkSeeder");

        await using var scope = serviceProvider.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var random = new Random(777);

        // ── Users: Avatar + CoverPhoto ────────────────────────────────────────
        var users = await db.Users.ToListAsync();
        int avatarCount = 0, coverCount = 0;

        foreach (var user in users)
        {
            // 85 % chance of avatar, 60 % chance of cover
            if (random.Next(100) < 85)
            {
                var seed = random.Next(1, 1000);
                var url = $"https://picsum.photos/seed/{seed}/400/400";
                user.UpdateAvatarUrl(url);
                avatarCount++;
            }

            if (random.Next(100) < 60)
            {
                var seed = random.Next(1000, 2000);
                var url = $"https://picsum.photos/seed/{seed}/1200/400";
                user.UpdateCoverPhotoUrl(url);
                coverCount++;
            }
        }

        await db.SaveChangesAsync();
        logger.LogInformation("Updated avatars for {Avatar} users, cover photos for {Cover} users.",
            avatarCount, coverCount);

        // ── Groups: CoverPhoto ────────────────────────────────────────────────
        var groups = await db.Groups.ToListAsync();
        int groupCoverCount = 0;

        foreach (var group in groups)
        {
            if (random.Next(100) < 70)
            {
                var seed = random.Next(2000, 3000);
                var url = $"https://picsum.photos/seed/{seed}/1200/400";
                group.UpdateCoverPhoto(url);
                groupCoverCount++;
            }
        }

        await db.SaveChangesAsync();
        logger.LogInformation("Updated cover photos for {Count} groups.", groupCoverCount);

        logger.LogInformation("User and group image seeding completed!");
    }
}
