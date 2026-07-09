using Application.Friend.Commands.AcceptFriendRequest;
using Application.Users.Queries.GetUpcomingBirthdays;
using Application.Users.Queries.GetTodayBirthdays;
using Application.Friend.Commands.CancelFriendRequest;
using Application.Friend.Commands.RejectFriendRequest;
using Application.Friend.Commands.SendFriendRequest;
using Application.Friend.Commands.SyncAllFriends;
using Application.Friend.Commands.Unfriend;
using Application.Friend.Queries.GetFriends;
using Application.Friend.Queries.GetFriendRecommendations;
using Application.Friend.Queries.GetFollowees;
using Application.Friend.Queries.GetIncomingFriendRequests;
using Application.Friend.Queries.GetMutualFriends;
using Application.Friend.Queries.GetShortestPath;
using Application.Users.Commands.FollowUser;
using Application.Users.Commands.UnfollowUser;
using Application.Users.Queries.GetPersonalInfo;
using Application.Users.Queries.GetUserHoverCard;
using Application.Users.Queries.SearchUsers;
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
using Infrastructure.Extensions;

namespace Presentation.Controllers
{
    [Authorize]
    [Route("api/users")]
    public class UserController : ApiController
    {
        public UserController(ISender sender) : base(sender)
        {
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile(CancellationToken cancellationToken)
        {
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
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Guid? currentUserId = null;

            if (!string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out var userId))
            {
                currentUserId = userId;
            }

            var query = new GetPersonalInfoQuery(id, currentUserId);

            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpGet("{id:guid}/hover-card")]
        public async Task<IActionResult> GetUserHoverCard(Guid id, CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Guid? currentUserId = null;

            if (!string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out var userId))
            {
                currentUserId = userId;
            }

            var query = new GetUserHoverCardQuery(id, currentUserId);

            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers(
            [FromQuery] string? q = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken cancellationToken = default)
        {
            var userId = GetCurrentUserId();
            var query = new SearchUsersQuery(q, userId, page, pageSize);
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

        [HttpPost("follow/{userId:guid}")]
        public async Task<IActionResult> FollowUser(
            Guid userId,
            CancellationToken cancellationToken)
        {
            var currentUserId = ClaimsPrincipalExtensions.GetUserId(User);

            var command = new FollowUserCommand(currentUserId, userId);

            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? NoContent() : HandleFailure(result);
        }

        [HttpPost("unfollow/{userId:guid}")]
        public async Task<IActionResult> UnfollowUser(
            Guid userId,
            CancellationToken cancellationToken)
        {
            var currentUserId = ClaimsPrincipalExtensions.GetUserId(User);

            var command = new UnfollowUserCommand(currentUserId, userId);

            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? NoContent() : HandleFailure(result);
        }

        [HttpGet("birthdays/today")]
        public async Task<IActionResult> GetTodayBirthdays(CancellationToken cancellationToken)
        {
            var currentUserId = ClaimsPrincipalExtensions.GetUserId(User);

            var query = new GetTodayBirthdaysQuery(currentUserId);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpGet("birthdays/upcoming")]
        public async Task<IActionResult> GetUpcomingBirthdays(CancellationToken cancellationToken)
        {
            var currentUserId = ClaimsPrincipalExtensions.GetUserId(User);

            var query = new GetUpcomingBirthdaysQuery(currentUserId);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        private Guid? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
        }
    }
}
