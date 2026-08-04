namespace Application.Abstractions;

/// <summary>
/// Sends a transactional email on behalf of the application. The
/// concrete implementation is wired up in the Infrastructure project;
/// the rest of the codebase depends on this interface so that the
/// transport (SMTP, SendGrid, log-only dev sink, ...) can change without
/// ripple effects.
/// </summary>
public interface IEmailService
{
    /// <summary>
    /// Sends a plain (no-attachment) email. Implementations are expected
    /// to be idempotent enough that callers don't need to retry on a
    /// transient failure — log it and let the operator investigate.
    /// </summary>
    /// <param name="to">Recipient email address.</param>
    /// <param name="subject">Subject line.</param>
    /// <param name="htmlBody">HTML body (the email is HTML-first).</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task SendAsync(string to, string subject, string htmlBody, CancellationToken cancellationToken = default);
}