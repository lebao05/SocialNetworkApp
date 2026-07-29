using Application.Abstractions.Messaging;

namespace Application.Auth.Commands.AdminLogin
{
    /// <summary>
    /// Authenticates a user that is allowed to access the admin (MVC) area.
    /// Returns a lightweight admin profile DTO on success; the controller
    /// then signs the user in via the cookie auth scheme.
    /// </summary>
    public sealed record AdminLoginCommand(string Email, string Password) : ICommand<AdminLoginResult>;

    public sealed record AdminLoginResult(
        Guid UserId,
        string Email,
        string FirstName,
        string LastName,
        IReadOnlyList<string> Roles);
}
