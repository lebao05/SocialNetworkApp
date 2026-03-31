using Application.Friends.Commands.AcceptFriendRequest;
using Application.Friends.Commands.SendFriendRequest;
using Infrastructure.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;

namespace Presentation.Controllers
{
    [Route("api/friend")]
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
    }
}
