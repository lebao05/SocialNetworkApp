using Application.Reels.Commands.CreateReel;
using Application.Reels.Commands.MarkStoryAsSeen;
using Application.Reels.Queries.GetReelsByUser;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;
using Presentation.Contracts.Reel;
using System.Security.Claims;

namespace Presentation.Controllers
{
    [Authorize]
    [Route("api/reels")]
    public class ReelController : ApiController
    {
        public ReelController(ISender sender) : base(sender)
        {
        }

        [HttpGet("user/{userId:guid}")]
        public async Task<IActionResult> GetReelsByUser(
            Guid userId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12,
            CancellationToken cancellationToken = default)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Guid? currentUserId = null;

            if (Guid.TryParse(userIdClaim, out var parsedUserId))
            {
                currentUserId = parsedUserId;
            }

            var query = new GetReelsByUserQuery(userId, page, pageSize, currentUserId);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpPost("create")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateReel(
            [FromForm] CreateReelRequest request,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            if (request.Video is null || request.Video.Length == 0)
            {
                return BadRequest("Video is required.");
            }

            using var videoStream = request.Video.OpenReadStream();
            using var thumbnailStream = request.Thumbnail?.OpenReadStream();

            var command = new CreateReelCommand(
                userId,
                request.Caption,
                request.AudioTitle,
                request.Visibility,
                new ReelAttachment(videoStream, request.Video.FileName, request.Video.ContentType, request.Video.Length),
                request.Thumbnail is null
                    ? null
                    : new ReelAttachment(thumbnailStream!, request.Thumbnail.FileName, request.Thumbnail.ContentType, request.Thumbnail.Length));

            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess
                ? Ok(new { id = result.Value })
                : HandleFailure(result);
        }

        [HttpPost("{storyId:long}/seen")]
        public async Task<IActionResult> MarkStoryAsSeen(long storyId, CancellationToken cancellationToken = default)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new MarkStoryAsSeenCommand(userId, storyId);
            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? Ok() : HandleFailure(result);
        }
    }
}
