using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Shared;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Application.Auth.Commands.ForgotPassword
{
    internal class ForgotPasswordCommandHandler : ICommandHandler<ForgotPasswordCommand, bool>
    {
        private readonly UserManager<User> _userManager;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly ILogger<ForgotPasswordCommandHandler> _logger;

        public ForgotPasswordCommandHandler(
            UserManager<User> userManager,
            IEmailService emailService,
            IConfiguration configuration,
            ILogger<ForgotPasswordCommandHandler> logger)
        {
            _userManager = userManager;
            _emailService = emailService;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<Result<bool>> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user is null)
            {
                _logger.LogInformation(
                    "ForgotPassword requested for unknown email {Email}.",
                    request.Email);
                return Result.Failure<bool>(new Error(
                    code: "Auth.UserNotFound",
                    message: "User with email not exists"));
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            // Build the SPA reset URL. ClientUrl comes from configuration
            // (appsettings: "ClientUrl") and is shared with CORS; falling
            // back to localhost keeps dev usable when the env var isn't set.
            var clientUrl = _configuration["ClientUrl"]?.TrimEnd('/')
                            ?? "http://localhost:5173";
            var resetUrl =
                $"{clientUrl}/reset-password" +
                $"?email={Uri.EscapeDataString(request.Email)}" +
                $"&token={Uri.EscapeDataString(token)}";

            var htmlBody = BuildResetEmailHtml(user, resetUrl);

            try
            {
                await _emailService.SendAsync(
                    to: user.Email!,
                    subject: "Reset your password",
                    htmlBody: htmlBody,
                    cancellationToken: cancellationToken);
            }
            catch (Exception ex)
            {
                // Email failures should never block the flow — we already
                // logged "would have sent" inside SmtpEmailService. Re-throw
                // only if you want callers to surface "email failed" to the
                // user, which leaks existence of the account.
                _logger.LogError(ex, "Failed to deliver password-reset email to {Email}.", user.Email);
            }

            return Result.Success(true);
        }

        private static string BuildResetEmailHtml(Domain.Entities.User user, string resetUrl)
        {
            // Inline-styled HTML so the email renders consistently across
            // mail clients (most strip <style>, but accept inline styles).
            var displayName = string.IsNullOrWhiteSpace(user.FirstName)
                ? (user.Email ?? "there")
                : user.FirstName;

            return $"""
            <!DOCTYPE html>
            <html>
              <body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Segoe UI',Tahoma,sans-serif;color:#0f172a;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:32px 0;">
                  <tr>
                    <td align="center">
                      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;padding:32px;border:1px solid #e2e8f0;">
                        <tr>
                          <td>
                            <h1 style="margin:0 0 16px 0;font-size:22px;color:#0f172a;">Reset your password</h1>
                            <p style="margin:0 0 16px 0;font-size:15px;line-height:1.5;color:#334155;">
                              Hi {System.Net.WebUtility.HtmlEncode(displayName)}, we received a request to reset the password for your account.
                            </p>
                            <p style="margin:0 0 24px 0;font-size:15px;line-height:1.5;color:#334155;">
                              Click the button below to choose a new password. This link expires in <strong>10 minutes</strong>.
                            </p>
                            <p style="margin:0 0 24px 0;">
                              <a href="{System.Net.WebUtility.HtmlEncode(resetUrl)}" style="display:inline-block;background-color:#2563eb;color:#ffffff;font-weight:700;font-size:15px;padding:12px 22px;border-radius:10px;text-decoration:none;">
                                Reset password
                              </a>
                            </p>
                            <p style="margin:0 0 12px 0;font-size:13px;color:#64748b;">
                              If the button doesn't work, paste this URL into your browser:
                            </p>
                            <p style="margin:0 0 24px 0;font-size:12px;word-break:break-all;color:#475569;background-color:#f1f5f9;padding:10px;border-radius:8px;">
                              {System.Net.WebUtility.HtmlEncode(resetUrl)}
                            </p>
                            <p style="margin:0;font-size:13px;color:#94a3b8;">
                              If you didn't request this, you can safely ignore the email.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
            """;
        }
    }
}