using Application.Abstractions;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Infrastructure.Services;

/// <summary>
/// SMTP-backed <see cref="IEmailService"/>. Settings come from the
/// "Email:Smtp" config section so the host, port, credentials, and
/// "from" address can all be overridden per environment without a
/// rebuild.
/// </summary>
/// <remarks>
/// We use MailKit rather than System.Net.Mail.SmtpClient — the latter
/// is officially deprecated and lacks modern auth / TLS handling. The
/// package is small, well-maintained, and is what ASP.NET Core's docs
/// recommend for new code.
/// </remarks>
public sealed class SmtpEmailService : IEmailService
{
    private readonly SmtpOptions _options;
    private readonly ILogger<SmtpEmailService> _logger;

    public SmtpEmailService(IOptions<SmtpOptions> options, ILogger<SmtpEmailService> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    public async Task SendAsync(string to, string subject, string htmlBody, CancellationToken cancellationToken = default)
    {
        // If the operator hasn't configured an SMTP host we fall back to
        // logging the rendered email. That keeps local development and
        // CI smoke tests functional without standing up an SMTP server,
        // and lets "ForgotPassword" still be tested end-to-end (the URL
        // is in the log line).
        if (string.IsNullOrWhiteSpace(_options.Host))
        {
            _logger.LogInformation(
                "Email:Smtp is not configured — would have sent email.\n  To: {To}\n  Subject: {Subject}\n  Body:\n{Body}",
                to, subject, htmlBody);
            return;
        }

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_options.FromName, _options.FromAddress));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = htmlBody,
            TextBody = StripHtml(htmlBody)
        };
        message.Body = bodyBuilder.ToMessageBody();

        using var client = new SmtpClient();

        // SecureSocketOptions.Auto picks StartTLS when the server advertises
        // it on the standard SMTP port (587) and falls back to SSL-on-connect
        // for the legacy SMTPS port (465). Setting it to None would disable
        // TLS entirely — that's almost never what production wants.
        var socketOption = _options.UseSsl
            ? SecureSocketOptions.Auto
            : SecureSocketOptions.StartTlsWhenAvailable;

        try
        {
            await client.ConnectAsync(_options.Host, _options.Port, socketOption, cancellationToken);

            if (!string.IsNullOrEmpty(_options.Username))
            {
                await client.AuthenticateAsync(_options.Username, _options.Password, cancellationToken);
            }

            await client.SendAsync(message, cancellationToken);
            _logger.LogInformation("Sent email to {To} via {Host}:{Port}.", to, _options.Host, _options.Port);
        }
        catch (Exception ex)
        {
            // Surface the failure to the caller (and Serilog) but don't
            // rethrow — the caller's behaviour shouldn't change based on
            // whether the email actually went out, and the operator can
            // diagnose from the log line.
            _logger.LogError(ex, "Failed to send email to {To} via {Host}:{Port}.", to, _options.Host, _options.Port);
        }
        finally
        {
            await client.DisconnectAsync(quit: true, cancellationToken);
        }
    }

    private static string StripHtml(string html)
    {
        // Tiny best-effort HTML stripper for the text/plain fallback.
        // We don't bring in a full HTML parser because this body is
        // always something we generated ourselves.
        var text = System.Text.RegularExpressions.Regex.Replace(html, "<[^>]+>", " ");
        return System.Net.WebUtility.HtmlDecode(text).Trim();
    }
}

/// <summary>
/// Bound from the "Email:Smtp" configuration section. Bind via
/// <c>services.Configure&lt;SmtpOptions&gt;(config.GetSection("Email:Smtp"))</c>.
/// </summary>
public sealed class SmtpOptions
{
    /// <summary>SMTP host (e.g. smtp.gmail.com). Leave empty to enable the log-only fallback.</summary>
    public string Host { get; set; } = string.Empty;

    /// <summary>SMTP port. Common values: 587 (StartTLS), 465 (SSL), 25 (plaintext).</summary>
    public int Port { get; set; } = 587;

    /// <summary>SMTP username. Empty means no AUTH.</summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>SMTP password.</summary>
    public string Password { get; set; } = string.Empty;

    /// <summary>Display name on outgoing mail.</summary>
    public string FromName { get; set; } = "Community";

    /// <summary>"From" address on outgoing mail (e.g. no-reply@example.com).</summary>
    public string FromAddress { get; set; } = "no-reply@example.com";

    /// <summary>
    /// When false the client still negotiates StartTLS when the server
    /// supports it, but never upgrades a plaintext connection to TLS.
    /// Set true only if you need explicit SSL-on-connect semantics.
    /// </summary>
    public bool UseSsl { get; set; } = false;
}