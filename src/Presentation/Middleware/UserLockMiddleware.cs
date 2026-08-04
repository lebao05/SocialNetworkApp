using System.Net;
using System.Net.Mime;
using System.Security.Claims;
using System.Text.Json;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Presentation.Middleware;

/// <summary>
/// Rejects every authenticated request whose actor has been locked by an admin
/// (<see cref="User.IsLocked"/>). The lock is enforced at the HTTP boundary
/// rather than per-handler so a single check covers every controller / hub
/// invocation, and a freshly locked account is denied on the very next
/// request without waiting for token refresh.
///
/// Behaviour:
///   • Anonymous requests pass through (authentication middleware will
///     challenge them). The user-lock check is only meaningful for an
///     authenticated principal.
///   • Authenticated requests look up <see cref="User.IsLocked"/> once per
///     request via <see cref="IUserRepository.GetByIdAsync"/>. The lookup
///     result is cached on <see cref="HttpContext.Items"/> so subsequent
///     handlers / controllers can reuse it without a second DB roundtrip.
///   • When locked, the response is a 403 with the same JSON shape used by
///     <see cref="Application.Shared.Result"/> failures
///     ({ "error": { "code": "User.Locked", "message": "..." } }) so the
///     frontend can branch on <c>code</c> uniformly with other failures.
///   • On a transient DB error we fail-open (log + pass through) so that an
///     infrastructure hiccup does not lock real users out of the product.
///     Failing closed here would convert a DB outage into an authentication
///     outage, which is the worse failure mode for a social network.
/// </summary>
public sealed class UserLockMiddleware
{
    // Claim type used by the Identity layer; we also fall back to
    // ClaimTypes.NameIdentifier when a JwtBearer principal didn't include the
    // URI-less "sub" claim explicitly.
    private const string NameIdentifierClaim = "sub";

    private readonly RequestDelegate _next;
    private readonly ILogger<UserLockMiddleware> _logger;

    public UserLockMiddleware(RequestDelegate next, ILogger<UserLockMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, IUserRepository userRepository)
    {
        if (!IsAuthenticated(context))
        {
            await _next(context);
            return;
        }

        if (!TryGetUserId(context, out var userId))
        {
            // Authenticated principal without a usable id claim — let the
            // pipeline continue and let downstream auth handlers reject if
            // they actually need an id. We don't synthesise a lock check
            // against a Guid.Empty.
            await _next(context);
            return;
        }

        // Cache the lookup so any downstream consumer in the same request
        // (e.g. a command handler) can re-use the entity without re-querying.
        if (context.Items.TryGetValue(UserLockContextKeys.User, out var cached) && cached is User)
        {
            await _next(context);
            return;
        }

        User? user;
        try
        {
            user = await userRepository.GetByIdAsync(userId, context.RequestAborted);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "User lock check failed for user {UserId}; failing open.", userId);
            await _next(context);
            return;
        }

        if (user is null)
        {
            // The principal is authenticated but the user no longer exists.
            // Treat as locked (it cannot perform any meaningful action).
            await WriteLockedResponseAsync(context, userId);
            return;
        }

        context.Items[UserLockContextKeys.User] = user;

        if (user.IsLocked)
        {
            await WriteLockedResponseAsync(context, userId);
            return;
        }

        await _next(context);
    }

    private static bool IsAuthenticated(HttpContext context)
    {
        return context.User?.Identity?.IsAuthenticated == true;
    }

    private static bool TryGetUserId(HttpContext context, out Guid userId)
    {
        userId = Guid.Empty;

        var raw = context.User!.FindFirst(NameIdentifierClaim)?.Value
                  ?? context.User!.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        return Guid.TryParse(raw, out userId);
    }

    private static async Task WriteLockedResponseAsync(HttpContext context, Guid userId)
    {

        context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
        context.Response.ContentType = MediaTypeNames.Application.Json;

        // Mirror the JSON shape produced by Result.Failure(...) so the SPA
        // can keep one error-decoding path.
        var payload = new
        {
            error = new
            {
                code = "User.Locked",
                message = "Your account is currently locked. You cannot perform this action."
            }
        };

        await JsonSerializer.SerializeAsync(
            context.Response.Body,
            payload,
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase },
            context.RequestAborted);
    }
}

/// <summary>
/// Keys used to stash per-request state under <see cref="HttpContext.Items"/>.
/// Centralising the string keys avoids typos and lets handlers reuse the
/// lookup without re-querying the database.
/// </summary>
public static class UserLockContextKeys
{
    public const string User = "UserLockMiddleware.User";
}