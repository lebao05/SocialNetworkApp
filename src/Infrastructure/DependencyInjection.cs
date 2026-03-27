using Application.Abstractions;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureDependencies(this IServiceCollection services)
        {
            return services;
        }
    }
}
