using Application.Abstractions;
using Application.Abstractions.Repositories;
using Application.Abstractions.Security;
using Infrastructure.Persistence.Repositories;
using Infrastructure.Security;
using Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Neo4j.Driver;
using Quartz;

namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureDependencies(this IServiceCollection services)
        {
            services.AddScoped<ITokenService, Authentication.TokenService>();
            services.AddScoped<IBlindIndexService, BlindIndexService>();
            services.AddScoped<IFeedGenerator, FeedGenerator>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IGroupRepository, GroupRepository>();
            services.AddScoped<IGroupReportRepository, GroupReportRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IFriendRequestRepository, FriendRequestRepository>();
            services.AddScoped<IFriendshipRepository, FriendshipRepository>();
            services.AddScoped<IConversationRepository, ConversationRepository>();
            services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddScoped<ISchoolRepository, SchoolRepository>();
            services.AddScoped<IPostRepository, PostRepository>();
            services.AddScoped<IFeedRepository, FeedRepository>();

            services.AddScoped<IUploadService>(provider =>
            {
                var configuration = provider.GetRequiredService<IConfiguration>();
                var cloudName = configuration["Cloudinary:CloudName"] ?? "";
                var apiKey = configuration["Cloudinary:ApiKey"] ?? "";
                var apiSecret = configuration["Cloudinary:ApiSecret"] ?? "";
                return new CloudinaryUploadService(cloudName, apiKey, apiSecret);
            });

            services.AddSingleton<IDriver>(provider =>
            {
                var configuration = provider.GetRequiredService<IConfiguration>();
                var neo4jUri = configuration["Neo4j:Uri"] ?? "";
                var neo4jUsername = configuration["Neo4j:Username"] ?? "";
                var neo4jPassword = configuration["Neo4j:Password"] ?? "";
                return GraphDatabase.Driver(neo4jUri, AuthTokens.Basic(neo4jUsername, neo4jPassword));
            });

            services.AddScoped<IFriendGraphService>(provider =>
            {
                var driver = provider.GetRequiredService<IDriver>();
                var configuration = provider.GetRequiredService<IConfiguration>();
                var database = configuration["Neo4j:Database"] ?? "neo4j";
                return new FriendGraphService(driver, database);
            });

            // Register Quartz services
            services.AddQuartz(q =>
            {
                var jobKey = new JobKey(nameof(BackgroundJobs.OutboxProcessingBackgroundService));
                q.AddJob<BackgroundJobs.OutboxProcessingBackgroundService>(opts => opts.WithIdentity(jobKey));

                q.AddTrigger(opts => opts
                    .ForJob(jobKey)
                    .WithIdentity(nameof(BackgroundJobs.OutboxProcessingBackgroundService) + "-trigger")
                    .WithSimpleSchedule(x => x
                            .WithInterval(TimeSpan.FromMilliseconds(500))
                            .RepeatForever()));
            });

            services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);

            return services;
        }
    }
}
