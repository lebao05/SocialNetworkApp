using Domain.Entities;
using Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Persistence.Contexts;

public static class RoleSeeder
{
    // Default seeded admin credentials — match the placeholder shown on the
    // /admin/login page so a fresh dev environment can sign in immediately.
    public const string AdminEmail = "admin@socialhub.com";
    public const string AdminPassword = "Admin@123";
    public const string AdminRole = "ADMIN";

    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        var logger = serviceProvider
            .GetRequiredService<ILoggerFactory>()
            .CreateLogger("RoleSeeder");

        logger.LogInformation("RoleSeeder starting...");

        try
        {
            var roleManager = serviceProvider
                .GetRequiredService<RoleManager<IdentityRole<Guid>>>();

            string[] roles = { "USER", AdminRole };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    var createRoleResult = await roleManager.CreateAsync(
                        new IdentityRole<Guid> { Name = role });
                    if (createRoleResult.Succeeded)
                    {
                        logger.LogInformation("Created role {Role}.", role);
                    }
                    else
                    {
                        logger.LogWarning(
                            "Failed to create role {Role}: {Errors}",
                            role,
                            string.Join(", ", createRoleResult.Errors.Select(e => e.Description)));
                    }
                }
                else
                {
                    logger.LogInformation("Role {Role} already exists.", role);
                }
            }

            await SeedDefaultAdminAsync(serviceProvider, logger);
            logger.LogInformation("RoleSeeder finished.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Role seeding failed. Continuing without seeded roles.");
        }
    }

    private static async Task SeedDefaultAdminAsync(
        IServiceProvider serviceProvider,
        ILogger logger)
    {
        var userManager = serviceProvider
            .GetRequiredService<UserManager<User>>();

        var existing = await userManager.FindByEmailAsync(AdminEmail);
        if (existing != null)
        {
            logger.LogInformation(
                "Admin user {Email} already exists (Id={UserId}). Ensuring role {Role}...",
                AdminEmail,
                existing.Id,
                AdminRole);

            // Make sure the user is in the ADMIN role even if the role was
            // added after the user.
            if (!await userManager.IsInRoleAsync(existing, AdminRole))
            {
                var roleResult = await userManager.AddToRoleAsync(existing, AdminRole);
                if (!roleResult.Succeeded)
                {
                    logger.LogWarning(
                        "Failed to assign {Role} to existing admin {Email}: {Errors}",
                        AdminRole,
                        AdminEmail,
                        string.Join(", ", roleResult.Errors.Select(e => e.Description)));
                }
                else
                {
                    logger.LogInformation("Assigned {Role} to existing admin {Email}.", AdminRole, AdminEmail);
                }
            }
            else
            {
                logger.LogInformation("Admin user {Email} already has role {Role}.", AdminEmail, AdminRole);
            }
            return;
        }

        logger.LogInformation("Admin user {Email} not found. Creating...", AdminEmail);

        var admin = new User(
            firstName: "Admin",
            lastName: "SocialHub",
            dateOfBirth: new DateOnly(1990, 1, 1),
            gender: Gender.Male,
            email: AdminEmail);

        var createResult = await userManager.CreateAsync(admin, AdminPassword);
        if (!createResult.Succeeded)
        {
            logger.LogWarning(
                "Failed to seed default admin user {Email}: {Errors}",
                AdminEmail,
                string.Join(", ", createResult.Errors.Select(e => e.Description)));
            return;
        }

        logger.LogInformation("Created admin user {Email} (Id={UserId}).", AdminEmail, admin.Id);

        var roleAddResult = await userManager.AddToRoleAsync(admin, AdminRole);
        if (!roleAddResult.Succeeded)
        {
            logger.LogWarning(
                "Seeded admin user {Email} but could not assign {Role}: {Errors}",
                AdminEmail,
                AdminRole,
                string.Join(", ", roleAddResult.Errors.Select(e => e.Description)));
            return;
        }

        logger.LogInformation(
            "Seeded default admin user {Email} with role {Role}.",
            AdminEmail,
            AdminRole);
    }
}