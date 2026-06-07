using Application.Friend.Commands.AcceptFriendRequest;
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
using Infrastructure.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;

namespace Presentation.Controllers
{
    [Route("api/friend")]
    [Authorize]
    public class FriendController : ApiController
    {
        public FriendController(ISender sender) : base(sender)
        {
        }

        [HttpPost("friend-request/{receiverId:Guid}")]
        public async Task<IActionResult> SendFriendRequest(
            Guid receiverId,
            CancellationToken ct)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);

            var command = new SendFriendRequestCommand(userId, receiverId);

            var result = await _sender.Send(command, ct);

            if (result.IsFailure)
                return HandleFailure(result);

            return Ok();
        }

        [HttpPost("accept")]
        public async Task<IActionResult> AcceptFriendRequest(
            [FromQuery]long requestId,
            CancellationToken ct)
        {
            Console.WriteLine(requestId);
            var userId = ClaimsPrincipalExtensions.GetUserId(User);

            var command = new AcceptFriendRequestCommand(requestId, userId);

            var result = await _sender.Send(command, ct);
            if (result.IsFailure)
                return HandleFailure(result);

            return Ok();
        }

        [HttpPost("reject")]
        public async Task<IActionResult> RejectFriendRequest(
            [FromQuery]long requestId,
            CancellationToken ct)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);

            var command = new RejectFriendRequestCommand(requestId, userId);

            var result = await _sender.Send(command, ct);
            if (result.IsFailure)
                return HandleFailure(result);

            return NoContent();
        }

        [HttpGet]
        public async Task<IActionResult> GetFriends(
            [FromQuery] Guid? userId = null,
            [FromQuery] int page = 1,
            [FromQuery] string? searchTerm = null,
            CancellationToken ct = default)
        {
            var currentUserId = ClaimsPrincipalExtensions.GetUserId(User);

            // If userId is provided and is not the current user, allow fetching their friends
            var targetUserId = userId ?? currentUserId;

            var query = new GetFriendsQuery(targetUserId, page, searchTerm);

            var result = await _sender.Send(query, ct);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpGet("requests/incoming")]
        public async Task<IActionResult> GetIncomingFriendRequests(
            [FromQuery] int page = 1,
            CancellationToken ct = default)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);

            var query = new GetIncomingFriendRequestsQuery(userId, page);
            var result = await _sender.Send(query, ct);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpGet("recommendations")]
        public async Task<IActionResult> GetFriendRecommendations(
            [FromQuery] int limit = 10,
            CancellationToken ct = default)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            var query = new GetFriendRecommendationsQuery(userId, limit);
            var result = await _sender.Send(query, ct);
            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpGet("followees")]
        public async Task<IActionResult> GetFollowees(
            [FromQuery] Guid? userId = null,
            CancellationToken ct = default)
        {
            var currentUserId = ClaimsPrincipalExtensions.GetUserId(User);
            var targetUserId = userId ?? currentUserId;

            var query = new GetFolloweesQuery(targetUserId);
            var result = await _sender.Send(query, ct);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpGet("mutual/{otherUserId:guid}")]
        public async Task<IActionResult> GetMutualFriends(
            Guid otherUserId,
            CancellationToken ct = default)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            var query = new GetMutualFriendsQuery(userId, otherUserId);
            var result = await _sender.Send(query, ct);
            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpGet("shortest-path/{otherUserId:guid}")]
        public async Task<IActionResult> GetShortestPath(
            Guid otherUserId,
            CancellationToken ct = default)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            var query = new GetShortestPathQuery(userId, otherUserId);
            var result = await _sender.Send(query, ct);
            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpPost("sync-all")]
        public async Task<IActionResult> SyncAllFriends(CancellationToken ct = default)
        {
            var command = new SyncAllFriendsCommand();
            var result = await _sender.Send(command, ct);
            return result.IsSuccess ? Ok(new { SyncedUsersCount = result.Value }) : HandleFailure(result);
        }

        [HttpDelete("{friendUserId:guid}")]
        public async Task<IActionResult> Unfriend(
            Guid friendUserId,
            CancellationToken ct)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);

            var command = new UnfriendCommand(userId, friendUserId);

            var result = await _sender.Send(command, ct);

            if (result.IsFailure)
                return HandleFailure(result);

            return NoContent();
        }

        [HttpDelete("cancel-request/{receiverId:guid}")]
        public async Task<IActionResult> CancelFriendRequest(
            Guid receiverId,
            CancellationToken ct)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);

            var command = new CancelFriendRequestCommand(userId, receiverId);

            var result = await _sender.Send(command, ct);

            return result.IsSuccess ? NoContent() : HandleFailure(result);
        }
    }
}
