using Application.Abstractions;
using Domain.Entities;
using Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services
{
    /// <summary>
    /// Background service that synchronizes users and friendships from PostgreSQL to Neo4j on application startup.
    /// </summary>
    public class Neo4jSyncService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<Neo4jSyncService> _logger;

        public Neo4jSyncService(
            IServiceProvider serviceProvider,
            ILogger<Neo4jSyncService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Neo4j synchronization service starting...");

            try
            {
                // Wait a bit to ensure the app is fully initialized
                await Task.Delay(TimeSpan.FromSeconds(2), stoppingToken);

                using var scope = _serviceProvider.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var graphService = scope.ServiceProvider.GetRequiredService<IFriendGraphService>();

                await SyncUsersAsync(dbContext, graphService, stoppingToken);
                await SyncFriendshipsAsync(dbContext, graphService, stoppingToken);

                _logger.LogInformation("Neo4j synchronization completed successfully.");
            }
            catch (OperationCanceledException)
            {
                _logger.LogWarning("Neo4j synchronization was cancelled.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during Neo4j synchronization.");
            }
        }

        private async Task SyncUsersAsync(
            AppDbContext dbContext,
            IFriendGraphService graphService,
            CancellationToken cancellationToken)
        {
            _logger.LogInformation("Starting user synchronization to Neo4j...");

            var users = await dbContext.Users
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            _logger.LogInformation("Found {Count} users to synchronize.", users.Count);

            var syncTasks = new List<Task>();
            foreach (var user in users)
            {
                syncTasks.Add(SyncUserAsync(graphService, user, cancellationToken));

                // Process in batches to avoid overwhelming Neo4j
                if (syncTasks.Count >= 50)
                {
                    await Task.WhenAll(syncTasks);
                    syncTasks.Clear();
                }
            }

            // Process remaining users
            if (syncTasks.Any())
            {
                await Task.WhenAll(syncTasks);
            }

            _logger.LogInformation("User synchronization completed. Synced {Count} users.", users.Count);
        }

        private async Task SyncUserAsync(
            IFriendGraphService graphService,
            User user,
            CancellationToken cancellationToken)
        {
            try
            {
                await graphService.SyncUserAsync(
                    user.Id,
                    user.UserName ?? string.Empty,
                    user.FirstName,
                    user.LastName,
                    user.AvatarUrl);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to sync user {UserId} to Neo4j.", user.Id);
            }
        }

        private async Task SyncFriendshipsAsync(
            AppDbContext dbContext,
            IFriendGraphService graphService,
            CancellationToken cancellationToken)
        {
            _logger.LogInformation("Starting friendship synchronization to Neo4j...");

            var friendships = await dbContext.Friendships
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            _logger.LogInformation("Found {Count} friendships to synchronize.", friendships.Count);

            var syncTasks = new List<Task>();
            foreach (var friendship in friendships)
            {
                syncTasks.Add(SyncFriendshipAsync(graphService, friendship, cancellationToken));

                // Process in batches
                if (syncTasks.Count >= 50)
                {
                    await Task.WhenAll(syncTasks);
                    syncTasks.Clear();
                }
            }

            // Process remaining friendships
            if (syncTasks.Any())
            {
                await Task.WhenAll(syncTasks);
            }

            _logger.LogInformation("Friendship synchronization completed. Synced {Count} friendships.", friendships.Count);
        }

        private async Task SyncFriendshipAsync(
            IFriendGraphService graphService,
            Friendship friendship,
            CancellationToken cancellationToken)
        {
            try
            {
                await graphService.SyncFriendshipAsync(friendship.User1Id, friendship.User2Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to sync friendship between {User1Id} and {User2Id} to Neo4j.",
                    friendship.User1Id, friendship.User2Id);
            }
        }
    }
}
