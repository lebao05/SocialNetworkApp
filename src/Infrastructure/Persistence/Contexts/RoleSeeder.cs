using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Persistence.Contexts;

public static class RoleSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        try
        {
            var roleManager = serviceProvider
                .GetRequiredService<RoleManager<IdentityRole<Guid>>>();

            string[] roles = { "USER", "ADMIN" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(
                        new IdentityRole<Guid> { Name = role }
                    );
                }
            }
        }
        catch (Exception ex)
        {
        }
    }
}