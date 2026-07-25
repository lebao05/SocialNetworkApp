using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [AllowAnonymous]
    [Route("admin")]
    public class AdminController : Controller
    {
        // ── MVC View Actions ──────────────────────────────

        [HttpGet("login")]
        [HttpGet("")]
        [HttpGet("/admin")]
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
        public IActionResult LoginPost(string email, string password, bool rememberMe, string? returnUrl)
        {
            // TODO: replace with real auth
            if (email == "admin@socialhub.com" && password == "Admin@123")
            {
                HttpContext.Session.SetString("AdminName", "Admin");
                HttpContext.Session.SetString("AdminRole", "Administrator");

                if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
                    return Redirect(returnUrl);

                return RedirectToAction(nameof(Dashboard));
            }

            TempData["Error"] = "Invalid email or password. Please try again.";
            return View("Login");
        }

        [HttpGet("dashboard")]
        public IActionResult Dashboard()
        {
            if (!IsAuthenticated()) return RedirectToAction(nameof(Login));
            ViewData["CurrentPage"] = "Dashboard";
            return View();
        }

        [HttpGet("users")]
        public IActionResult Users()
        {
            if (!IsAuthenticated()) return RedirectToAction(nameof(Login));
            ViewData["CurrentPage"] = "Users";
            return View();
        }

        [HttpGet("moderation")]
        public IActionResult Moderation()
        {
            if (!IsAuthenticated()) return RedirectToAction(nameof(Login));
            ViewData["CurrentPage"] = "Moderation";
            return View();
        }

        [HttpGet("auditlogs")]
        public IActionResult AuditLogs()
        {
            if (!IsAuthenticated()) return RedirectToAction(nameof(Login));
            ViewData["CurrentPage"] = "AuditLogs";
            return View();
        }

        [HttpGet("reports")]
        public IActionResult Reports()
        {
            if (!IsAuthenticated()) return RedirectToAction(nameof(Login));
            ViewData["CurrentPage"] = "Reports";
            return View();
        }

        [HttpGet("settings")]
        public IActionResult Settings()
        {
            if (!IsAuthenticated()) return RedirectToAction(nameof(Login));
            ViewData["CurrentPage"] = "Settings";
            return View();
        }

        [HttpGet("forgot-password")]
        public IActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
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
