using Application.Abstractions;
using Application.Abstractions.Repositories;
using Application.Abstractions.Security;
using Infrastructure.Persistence.Repositories;
using Infrastructure.Security;
using Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureDependencies(this IServiceCollection services)
        {
            services.AddScoped<ITokenService, Authentication.TokenService>();
            services.AddScoped<IBlindIndexService, BlindIndexService>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IFriendRequestRepository, FriendRequestRepository>();
            services.AddScoped<IFriendshipRepository, FriendshipRepository>();
            services.AddScoped<IConversationRepository, ConversationRepository>();
            services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddScoped<ISchoolRepository, SchoolRepository>();

            services.AddScoped<IUploadService>(provider =>
            {
                var configuration = provider.GetRequiredService<IConfiguration>();
                var cloudName = configuration["Cloudinary:CloudName"] ?? "";
                var apiKey = configuration["Cloudinary:ApiKey"] ?? "";
                var apiSecret = configuration["Cloudinary:ApiSecret"] ?? "";
                return new CloudinaryUploadService(cloudName, apiKey, apiSecret);
            });

            return services;
        }
    }
}
