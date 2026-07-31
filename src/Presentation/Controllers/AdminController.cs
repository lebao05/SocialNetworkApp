using Application.Admin.Commands.ReviewReport;
using Application.Admin.Commands.SetGroupLock;
using Application.Admin.Commands.SetUserLock;
using Application.Admin.Commands.SetUserRole;
using Application.Admin.Commands.SetPostLock;
using Application.Admin.Commands.SetReelLock;
using Application.Admin.Queries.GetModerationReports;
using Application.Admin.Queries.SearchAdminGroups;
using Application.Admin.Queries.SearchAdminUsers;
using Application.Auth.Commands.AdminLogin;
using Application.Shared;
using Domain.Entities;
using Domain.Shared;
using Infrastructure.Persistence.Contexts;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Security.Claims;

namespace Presentation.Controllers
{
    [AllowAnonymous]
    [Route("admin")]
    public class AdminController : Controller
    {
        private const string AdminCookieScheme = "AdminCookie";
        private const string AdminRole = "ADMIN";
        private readonly ISender _sender;

        public AdminController(ISender sender)
        {
            _sender = sender;
        }

        // ── MVC View Actions ──────────────────────────────

        [HttpGet("login", Name = "AdminLogin")]
        [HttpGet("/admin", Name = "AdminRoot")]
        public IActionResult Login(string? returnUrl = null)
        {
            if (User.Identity?.IsAuthenticated == true
                || HttpContext.Session.GetString("AdminName") != null)
            {
                return RedirectToAction(nameof(Dashboard));
            }
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        [HttpPost("login")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> LoginPost(
            string email,
            string password,
            bool rememberMe,
            string? returnUrl)
        {
            var command = new AdminLoginCommand(email, password);

            var result = await _sender.Send(command, HttpContext.RequestAborted);
            if (result.IsFailure)
            {
                TempData["Error"] = result.Error.Message;
                return View("Login");
            }

            var profile = result.Value;

            // Build the cookie's ClaimsIdentity so [Authorize(Roles = "ADMIN")]
            // can enforce role checks against the cookie principal.
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, profile.UserId.ToString()),
                new(ClaimTypes.Email, profile.Email),
                new(ClaimTypes.Name, $"{profile.FirstName} {profile.LastName}".Trim()),
                new(ClaimTypes.Role, AdminRole),
            };
            // Preserve any extra roles the user may have.
            foreach (var role in profile.Roles)
            {
                if (!claims.Any(c => c.Type == ClaimTypes.Role && c.Value == role))
                    claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var identity = new ClaimsIdentity(claims, AdminCookieScheme);
            var principal = new ClaimsPrincipal(identity);

            var authProps = new AuthenticationProperties
            {
                IsPersistent = rememberMe,
                ExpiresUtc = rememberMe
                    ? DateTimeOffset.UtcNow.AddDays(7)
                    : DateTimeOffset.UtcNow.AddHours(8),
                AllowRefresh = true,
            };

            await HttpContext.SignInAsync(
                AdminCookieScheme,
                principal,
                authProps);

            // Mirror a few useful values into session for the views that read
            // them via HttpContext.Session.GetString("AdminName") etc.
            HttpContext.Session.SetString("AdminName", profile.Email);
            HttpContext.Session.SetString("AdminRole", AdminRole);

            if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
                return Redirect(returnUrl);

            return RedirectToAction(nameof(Dashboard));
        }

        [HttpGet("dashboard")]
        [Authorize(Roles = AdminRole)]
        public IActionResult Dashboard()
        {
            if (!IsAuthenticated()) return RedirectToAction(nameof(Login));
            ViewData["CurrentPage"] = "Dashboard";
            return View();
        }

        [HttpGet("users")]
        [Authorize(Roles = AdminRole)]
        public IActionResult Users()
        {
            if (!IsAuthenticated()) return RedirectToAction(nameof(Login));
            ViewData["CurrentPage"] = "Users";
            return View();
        }

        [HttpGet("moderation")]
        [Authorize(Roles = AdminRole)]
        public IActionResult Moderation()
        {
            if (!IsAuthenticated()) return RedirectToAction(nameof(Login));
            ViewData["CurrentPage"] = "Moderation";
            return View();
        }

        [HttpGet("auditlogs")]
        [Authorize(Roles = AdminRole)]
        public IActionResult AuditLogs()
        {
            if (!IsAuthenticated()) return RedirectToAction(nameof(Login));
            ViewData["CurrentPage"] = "AuditLogs";
            return View();
        }

        [HttpGet("reports")]
        [Authorize(Roles = AdminRole)]
        public IActionResult Reports()
        {
            if (!IsAuthenticated()) return RedirectToAction(nameof(Login));
            ViewData["CurrentPage"] = "Reports";
            return View();
        }

        [HttpGet("groups")]
        [Authorize(Roles = AdminRole)]
        public IActionResult Groups(string? q, string? privacy, string? status)
        {
            if (!IsAuthenticated()) return RedirectToAction(nameof(Login));
            ViewData["CurrentPage"] = "Groups";
            ViewData["Query"] = q;
            ViewData["Privacy"] = privacy;
            ViewData["Status"] = status;
            return View();
        }

        [HttpGet("forgot-password")]
        public IActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost("forgot-password")]
        [ValidateAntiForgeryToken]
        public IActionResult ForgotPassword(string email)
        {
            // Password reset flow is not implemented yet. Show a generic
            // success message regardless of whether the email exists, so
            // we don't leak account presence.
            TempData["ResetSent"] = "If an admin account exists for that email, a reset link has been sent.";
            return RedirectToAction(nameof(Login));
        }

        /// <summary>
        /// DEV-ONLY: ensures the default admin user exists and returns a JSON
        /// report describing the current state of the admin account. Use this
        /// to verify whether the seed ran successfully.
        ///
        /// GET /admin/seed-admin
        /// POST /admin/seed-admin  (idempotent — runs the seeder again)
        /// </summary>
        [HttpGet("seed-admin")]
        [HttpPost("seed-admin")]
        public async Task<IActionResult> SeedAdmin()
        {
            await RoleSeeder.SeedAsync(HttpContext.RequestServices);

            var userManager = HttpContext.RequestServices
                .GetRequiredService<UserManager<User>>();
            var roleManager = HttpContext.RequestServices
                .GetRequiredService<RoleManager<IdentityRole<Guid>>>();

            var user = await userManager.FindByEmailAsync(RoleSeeder.AdminEmail);
            var roles = user != null ? await userManager.GetRolesAsync(user) : new List<string>();

            return Json(new
            {
                adminEmail       = RoleSeeder.AdminEmail,
                userExists       = user != null,
                userId           = user?.Id,
                emailConfirmed   = user?.EmailConfirmed,
                roles            = roles,
                isAdmin          = roles.Contains(RoleSeeder.AdminRole),
                rolesSeeded      = new
                {
                    admin = await roleManager.RoleExistsAsync(RoleSeeder.AdminRole),
                    user  = await roleManager.RoleExistsAsync("USER"),
                },
            });
        }

        /// <summary>
        /// DEV-ONLY: seeds diversified test data (users, posts, reels, groups,
        /// comments, reports) for admin dashboard testing.
        ///
        /// GET  /admin/seed-test-data    — returns current state
        /// POST /admin/seed-test-data   — runs the seeder (idempotent)
        /// DELETE /admin/seed-test-data — clears test data
        /// </summary>
        [HttpGet("seed-test-data")]
        [HttpPost("seed-test-data")]
        [HttpDelete("seed-test-data")]
        public async Task<IActionResult> SeedTestData()
        {
            var method = HttpContext.Request.Method;

            if (HttpContext.Request.Method == "DELETE")
            {
                await TestDataSeeder.ClearTestDataAsync(HttpContext.RequestServices);
                return Json(new { message = "Test data cleared." });
            }

            await TestDataSeeder.SeedAsync(HttpContext.RequestServices);

            using var scope = HttpContext.RequestServices.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var userCount    = await db.Users.Where(u => u.Email != RoleSeeder.AdminEmail).CountAsync<User>();
            var postCount    = await db.Posts.CountAsync<Post>();
            var reelCount    = await db.Reels.CountAsync<Reel>();
            var groupCount   = await db.Groups.CountAsync<Group>();
            var reportCount  = await db.Reports.CountAsync<Domain.Entities.Report>();
            var commentCount = await db.PostComments.CountAsync<PostComment>()
                             + await db.ReelComments.CountAsync<ReelComment>();

            return Json(new
            {
                message     = "Test data seeded.",
                counts = new
                {
                    users    = userCount,
                    posts    = postCount,
                    reels    = reelCount,
                    groups   = groupCount,
                    reports  = reportCount,
                    comments = commentCount,
                }
            });
        }

        /// <summary>
        /// DEV-ONLY: runs raw ALTER TABLE statements to add IsLocked to Posts and
        /// Reels without requiring a migration. Safe to call multiple times — uses
        /// IF NOT EXISTS semantics so it won't fail if the column already exists.
        ///
        /// GET /admin/ensure-columns
        /// </summary>
        [HttpGet("ensure-columns")]
        public async Task<IActionResult> EnsureColumns()
        {
            using var scope = HttpContext.RequestServices.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var results = new List<string>();

            try
            {
                await db.Database.ExecuteSqlRawAsync(
                    @"ALTER TABLE ""Posts"" ADD COLUMN IF NOT EXISTS ""IsLocked"" BOOLEAN NOT NULL DEFAULT FALSE");
                results.Add("Posts.IsLocked — OK");
            }
            catch (Exception ex)
            {
                results.Add($"Posts.IsLocked — ERROR: {ex.Message}");
            }

            try
            {
                await db.Database.ExecuteSqlRawAsync(
                    @"ALTER TABLE ""Reels"" ADD COLUMN IF NOT EXISTS ""IsLocked"" BOOLEAN NOT NULL DEFAULT FALSE");
                results.Add("Reels.IsLocked — OK");
            }
            catch (Exception ex)
            {
                results.Add($"Reels.IsLocked — ERROR: {ex.Message}");
            }

            return Json(new { results });
        }

        [HttpPost("logout")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(AdminCookieScheme);
            HttpContext.Session.Clear();
            return RedirectToAction(nameof(Login));
        }

        // ── AJAX endpoints (Users / Groups admin pages) ───────────

        /// <summary>
        /// GET /admin/users/list?q=&status=&role=&page=&pageSize=
        /// Returns a paged, filtered list for the admin Users page.
        /// </summary>
        [HttpGet("users/list")]
        [Authorize(Roles = AdminRole)]
        public async Task<IActionResult> UsersList(
            [FromQuery] string? q,
            [FromQuery] string? status,
            [FromQuery] string? role,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken ct = default)
        {
            var result = await _sender.Send(
                new SearchAdminUsersQuery(q, status, role, page, pageSize), ct);

            return result.IsSuccess
                ? Ok(ToListPayload(result.Value))
                : StatusCode(500, new { error = result.Error.Message });
        }

        /// <summary>POST /admin/users/{id}/lock — flip IsLocked on.</summary>
        [HttpPost("users/{id:guid}/lock")]
        [Authorize(Roles = AdminRole)]
        public async Task<IActionResult> LockUser(Guid id, CancellationToken ct = default)
        {
            var result = await _sender.Send(new SetUserLockCommand(id, true), ct);
            return result.IsSuccess
                ? Ok(result.Value)
                : NotFound(new { error = result.Error.Message });
        }

        /// <summary>POST /admin/users/{id}/unlock — flip IsLocked off.</summary>
        [HttpPost("users/{id:guid}/unlock")]
        [Authorize(Roles = AdminRole)]
        public async Task<IActionResult> UnlockUser(Guid id, CancellationToken ct = default)
        {
            var result = await _sender.Send(new SetUserLockCommand(id, false), ct);
            return result.IsSuccess
                ? Ok(result.Value)
                : NotFound(new { error = result.Error.Message });
        }

        /// <summary>POST /admin/users/{id}/promote — grant the ADMIN role.</summary>
        [HttpPost("users/{id:guid}/promote")]
        [Authorize(Roles = AdminRole)]
        public async Task<IActionResult> PromoteUser(Guid id, CancellationToken ct = default)
        {
            var actingId = CurrentUserId();
            var result = await _sender.Send(new SetUserRoleCommand(id, actingId, true), ct);
            return result.IsSuccess
                ? Ok(result.Value)
                : ToHttpResult(result.Error);
        }

        /// <summary>POST /admin/users/{id}/demote — strip the ADMIN role.</summary>
        [HttpPost("users/{id:guid}/demote")]
        [Authorize(Roles = AdminRole)]
        public async Task<IActionResult> DemoteUser(Guid id, CancellationToken ct = default)
        {
            var actingId = CurrentUserId();
            var result = await _sender.Send(new SetUserRoleCommand(id, actingId, false), ct);
            return result.IsSuccess
                ? Ok(result.Value)
                : ToHttpResult(result.Error);
        }

        private Guid CurrentUserId()
        {
            var raw = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(raw, out var g) ? g : Guid.Empty;
        }

        private IActionResult ToHttpResult(Error error)
        {
            // Self-role-change is a client error (don't 500), everything else
            // (UserNotFound) is 404. Keep the original message so the JS layer
            // can surface it.
            if (error.Code == "Admin.SelfRoleChange")
                return BadRequest(new { error = error.Message });
            return NotFound(new { error = error.Message });
        }

        /// <summary>GET /admin/groups/list?q=&privacy=&status=&page=&pageSize=</summary>
        [HttpGet("groups/list")]
        [Authorize(Roles = AdminRole)]
        public async Task<IActionResult> GroupsList(
            [FromQuery] string? q,
            [FromQuery] string? privacy,
            [FromQuery] string? status,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken ct = default)
        {
            var result = await _sender.Send(
                new SearchAdminGroupsQuery(q, privacy, status, page, pageSize), ct);

            return result.IsSuccess
                ? Ok(ToListPayload(result.Value))
                : StatusCode(500, new { error = result.Error.Message });
        }

        /// <summary>POST /admin/groups/{id}/lock</summary>
        [HttpPost("groups/{id:long}/lock")]
        [Authorize(Roles = AdminRole)]
        public async Task<IActionResult> LockGroup(long id, CancellationToken ct = default)
        {
            var result = await _sender.Send(new SetGroupLockCommand(id, true), ct);
            return result.IsSuccess
                ? Ok(result.Value)
                : NotFound(new { error = result.Error.Message });
        }

        /// <summary>POST /admin/groups/{id}/unlock</summary>
        [HttpPost("groups/{id:long}/unlock")]
        [Authorize(Roles = AdminRole)]
        public async Task<IActionResult> UnlockGroup(long id, CancellationToken ct = default)
        {
            var result = await _sender.Send(new SetGroupLockCommand(id, false), ct);
            return result.IsSuccess
                ? Ok(result.Value)
                : NotFound(new { error = result.Error.Message });
        }

        // ── Moderation endpoints ────────────────────────────────────────────────

        /// <summary>GET /admin/moderation/reports?type=&status=&from=&to=&page=&pageSize=</summary>
        [HttpGet("moderation/reports")]
        [Authorize(Roles = AdminRole)]
        public async Task<IActionResult> ModerationReports(
            [FromQuery] string? type,
            [FromQuery] string? status,
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken ct = default)
        {
            Domain.Enums.ReportType? reportType = null;
            Domain.Enums.ReportStatus? reportStatus = null;

            if (!string.IsNullOrEmpty(type) && Enum.TryParse<Domain.Enums.ReportType>(type, ignoreCase: true, out var rt))
                reportType = rt;

            if (!string.IsNullOrEmpty(status) && Enum.TryParse<Domain.Enums.ReportStatus>(status, ignoreCase: true, out var rs))
                reportStatus = rs;

            var result = await _sender.Send(
                new GetModerationReportsQuery(reportType, reportStatus, from, to, page, pageSize), ct);

            if (result.IsFailure)
                return StatusCode(500, new { error = result.Error.Message });

            var payload = result.Value;
            return Ok(new
            {
                items      = payload.Items,
                page       = payload.Page,
                pageSize   = payload.PageSize,
                totalCount = payload.TotalCount,
                totalPages = (int)Math.Ceiling((double)payload.TotalCount / payload.PageSize),
                hasNext    = payload.Page * payload.PageSize < payload.TotalCount,
                hasPrev    = payload.Page > 1,
            });
        }

        /// <summary>POST /admin/moderation/reports/{id}/review</summary>
        [HttpPost("moderation/reports/{id:long}/review")]
        [Authorize(Roles = AdminRole)]
        public async Task<IActionResult> ReviewReport(
            long id,
            [FromBody] ReviewReportRequest body,
            CancellationToken ct = default)
        {
            var reviewerId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)
                is { Value: var uid } && Guid.TryParse(uid, out var rid)
                ? rid
                : Guid.Empty;

            var result = await _sender.Send(new ReviewReportCommand(
                id, reviewerId, body.Action, body.IsDismissed, body.ReviewNote), ct);

            return result.IsSuccess
                ? Ok(result.Value)
                : NotFound(new { error = result.Error.Message });
        }

        /// <summary>POST /admin/moderation/posts/{id}/lock</summary>
        [HttpPost("moderation/posts/{id:long}/lock")]
        [Authorize(Roles = AdminRole)]
        public async Task<IActionResult> LockPost(long id, CancellationToken ct = default)
        {
            var result = await _sender.Send(new SetPostLockCommand(id, true), ct);
            return result.IsSuccess
                ? Ok(result.Value)
                : NotFound(new { error = result.Error.Message });
        }

        /// <summary>POST /admin/moderation/posts/{id}/unlock</summary>
        [HttpPost("moderation/posts/{id:long}/unlock")]
        [Authorize(Roles = AdminRole)]
        public async Task<IActionResult> UnlockPost(long id, CancellationToken ct = default)
        {
            var result = await _sender.Send(new SetPostLockCommand(id, false), ct);
            return result.IsSuccess
                ? Ok(result.Value)
                : NotFound(new { error = result.Error.Message });
        }

        /// <summary>POST /admin/moderation/reels/{id}/lock</summary>
        [HttpPost("moderation/reels/{id:long}/lock")]
        [Authorize(Roles = AdminRole)]
        public async Task<IActionResult> LockReel(long id, CancellationToken ct = default)
        {
            var result = await _sender.Send(new SetReelLockCommand(id, true), ct);
            return result.IsSuccess
                ? Ok(result.Value)
                : NotFound(new { error = result.Error.Message });
        }

        /// <summary>POST /admin/moderation/reels/{id}/unlock</summary>
        [HttpPost("moderation/reels/{id:long}/unlock")]
        [Authorize(Roles = AdminRole)]
        public async Task<IActionResult> UnlockReel(long id, CancellationToken ct = default)
        {
            var result = await _sender.Send(new SetReelLockCommand(id, false), ct);
            return result.IsSuccess
                ? Ok(result.Value)
                : NotFound(new { error = result.Error.Message });
        }

        // PagedList<T> → JSON. The handler stays typed; the controller is the
        // only place that needs to know what shape JS expects.
        private static object ToListPayload<T>(PagedList<T> list) => new
        {
            items      = list.Items,
            page       = list.PageNumber,
            pageSize   = list.PageSize,
            totalCount = list.TotalCount,
            totalPages = list.TotalPages,
            hasNext    = list.HasNextPage,
            hasPrev    = list.HasPreviousPage,
        };

        // ── Private helpers ───────────────────────────────

        private bool IsAuthenticated()
        {
            return User.Identity?.IsAuthenticated == true
                || HttpContext.Session.GetString("AdminName") != null;
        }
    }

    // Simple body DTO for the review endpoint so ASP.NET can bind [FromBody].
    public record ReviewReportRequest(
        ReportReviewAction Action,
        bool IsDismissed,
        string? ReviewNote = null
    );
}
