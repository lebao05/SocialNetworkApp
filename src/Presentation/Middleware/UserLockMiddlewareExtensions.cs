using Microsoft.AspNetCore.Builder;

namespace Presentation.Middleware;

public static class UserLockMiddlewareExtensions
{
    /// <summary>
    /// Adds <see cref="UserLockMiddleware"/> to the request pipeline. Must be
    /// called AFTER <c>UseAuthentication</c> (so an authenticated principal is
    /// available) and AFTER <c>UseAuthorization</c> (so policy-driven rejections
    /// still happen for unauthenticated callers).
    /// </summary>
    public static IApplicationBuilder UseUserLock(this IApplicationBuilder app)
    {
        return app.UseMiddleware<UserLockMiddleware>();
    }
}