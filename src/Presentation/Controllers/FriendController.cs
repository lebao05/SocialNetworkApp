using Application.Friend.Commands.AcceptFriendRequest;
using Application.Friend.Commands.SendFriendRequest;
using Application.Friend.Queries.GetFriends;
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
        [HttpPost("friend-request")]
        public async Task<IActionResult> SendFriendRequest(
            Guid receiverId,
            CancellationToken ct)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User); // from JWT

            var command = new SendFriendRequestCommand(userId, receiverId);

            var result = await _sender.Send(command, ct);

            if (result.IsFailure)
                return HandleFailure(result);

            return Ok();
        }
        [HttpPost("accept")]
        public async Task<IActionResult> AcceptFriendRequest(
            long requestId,
            CancellationToken ct)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User); 

            var command = new AcceptFriendRequestCommand(requestId, userId);

            var result = await _sender.Send(command, ct);

            if (result.IsFailure)
                return HandleFailure(result);

            return Ok();
        }
        [HttpGet]
        public async Task<IActionResult> GetFriends(CancellationToken ct)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);

            var query = new GetFriendsQuery(userId);

            var result = await _sender.Send(query, ct);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }
    }
}
