using Application.Auth.Commands.AdminLogin;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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

        [HttpPost("logout")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(AdminCookieScheme);
            HttpContext.Session.Clear();
            return RedirectToAction(nameof(Login));
        }

        // ── Private helpers ───────────────────────────────

        private bool IsAuthenticated()
        {
            return User.Identity?.IsAuthenticated == true
                || HttpContext.Session.GetString("AdminName") != null;
        }
    }
}
