namespace Presentation.Contracts.Auth
{
    public sealed record ResetPasswordRequest(
        string Email,
        string Token,
        string NewPassword);
}