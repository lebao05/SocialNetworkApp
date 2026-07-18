using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        [HttpGet]
        public IActionResult Index()
        {
            return Ok(new
            {
                Message = "Welcome to the Admin area!",
                User = User.Identity?.Name,
                Roles = User.Claims
                    .Where(c => c.Type.Contains("role"))
                    .Select(c => c.Value)
            });
        }

        [HttpGet("ping")]
        [AllowAnonymous]
        public IActionResult Ping()
        {
            return Ok("Admin controller is working.");
        }
    }
}