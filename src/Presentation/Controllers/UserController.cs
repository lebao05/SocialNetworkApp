using Application.Friend.Queries.GetFriends;
using Application.Users.Queries.GetPersonalInfo;
using Application.Users.Commands.UploadAvatar;
using Application.Users.Commands.UploadCoverPhoto;
using Application.Users.Commands.UpdateInfo;
using Presentation.Contracts.User;
using Microsoft.AspNetCore.Http;
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

            var query = new GetPersonalInfoQuery(userId);

            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpGet("{id:guid}/personal-info")]
        public async Task<IActionResult> GetPersonalInfo(Guid id, CancellationToken cancellationToken)
        {
            var query = new GetPersonalInfoQuery(id);

            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpPut("info")]
        public async Task<IActionResult> UpdateInfo(
            [FromBody] UpdateInfoRequest request,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new UpdateInfoCommand(
                userId,
                request.FirstName,
                request.LastName,
                request.DateOfBirth,
                request.Gender,
                request.Bio,
                request.CurrentLocation,
                request.Hometown,
                request.Website,
                request.RelationshipStatus
            );

            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? NoContent() : HandleFailure(result);
        }

        [HttpPost("avatar")]
        public async Task<IActionResult> UploadAvatar(
            IFormFile file,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            if (file == null || file.Length == 0)
            {
                return BadRequest("File is empty.");
            }

            using var stream = file.OpenReadStream();
            var command = new UploadAvatarCommand(userId, stream, file.FileName);

            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? Ok(new { Url = result.Value }) : HandleFailure(result);
        }

        [HttpPost("cover-photo")]
        public async Task<IActionResult> UploadCoverPhoto(
            IFormFile file,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            if (file == null || file.Length == 0)
            {
                return BadRequest("File is empty.");
            }

            using var stream = file.OpenReadStream();
            var command = new UploadCoverPhotoCommand(userId, stream, file.FileName);

            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? Ok(new { Url = result.Value }) : HandleFailure(result);
        }
    }
}