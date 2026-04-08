using Application.Friend.Queries.GetFriends;
using Application.Users.Queries.GetUserProfile;
using Domain.Shared;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;
using System.Security.Claims;

namespace Presentation.Controllers
{
    [Authorize] // Profile and Friends require authentication
    [Route("api/users")]
    public class UserController : ApiController
    {
        public UserController(ISender sender) : base(sender)
        {
        }
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile(CancellationToken cancellationToken)
        {
            // Extracting the NameIdentifier (Guid) from the JWT claims
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var query = new GetUserProfileQuery(userId);

            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }
    }
}