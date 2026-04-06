using Application.Abstractions;
using Application.Abstractions.Repositories;
using Infrastructure.Persistence.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureDependencies(this IServiceCollection services)
        {
            services.AddScoped<ITokenService, Authentication.TokenService>();
            services.AddScoped<IUserRepository,UserRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IFriendRequestRepository, FriendRequestRepository>();
            services.AddScoped<IFriendshipRepository, FriendshipRepository>();
            services.AddScoped<IConversationRepository,ConversationRepository>();
            services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddSignalRCore();

            return services;
        }
    }
}
