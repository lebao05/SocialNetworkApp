using Application.Admin.Commands.SetGroupLock;
using Application.Admin.Commands.SetUserLock;
using Application.Admin.Queries.SearchAdminGroups;
using Application.Admin.Queries.SearchAdminUsers;
using Application.Auth.Commands.AdminLogin;
using Application.Shared;
using Domain.Entities;
using Infrastructure.Persistence.Contexts;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
}
