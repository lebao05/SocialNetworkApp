using Application.Reels.Commands.CreateReel;
using Application.Reels.Commands.CreateReelComment;
using Application.Reels.Commands.MarkStoryAsSeen;
using Application.Reels.Commands.RecordReelView;
using Application.Reels.Commands.ToggleLikeReel;
using Application.Reels.Commands.DeleteReel;
using Application.Reels.Queries.GetReelsByUser;
using Application.Reels.Queries.GetRecommendedReels;
using Application.Reels.Queries.GetReelById;
using Application.Reels.Queries.GetReelComments;
using Application.Reels.Queries.GetTopReels;
using Application.Reels.Queries.SearchReels;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;
using Presentation.Contracts.Reel;
using System.Security.Claims;
using Infrastructure.Extensions;

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

        [HttpGet("recommended")]
        public async Task<IActionResult> GetRecommendedReels(
            [FromQuery] int pageSize = 12,
            CancellationToken cancellationToken = default)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var query = new GetRecommendedReelsQuery(userId, pageSize);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpGet("top")]
        public async Task<IActionResult> GetTopReels(
            [FromQuery] int pageSize = 6,
            CancellationToken cancellationToken = default)
        {
            var query = new GetTopReelsQuery(pageSize);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchReels(
            [FromQuery] string? q = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken cancellationToken = default)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            var query = new SearchReelsQuery(userId, q, page, pageSize);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpGet("{reelId:long}")]
        public async Task<IActionResult> GetReelById(long reelId, CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Guid? currentUserId = null;

            if (Guid.TryParse(userIdClaim, out var parsedUserId))
            {
                currentUserId = parsedUserId;
            }

            var query = new GetReelByIdQuery(reelId, currentUserId);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpGet("{reelId:long}/comments")]
        public async Task<IActionResult> GetReelComments(
            long reelId,
            [FromQuery] long? parentCommentId = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            CancellationToken cancellationToken = default)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Guid? userId = null;

            if (Guid.TryParse(userIdClaim, out var parsedUserId))
            {
                userId = parsedUserId;
            }

            var query = new GetReelCommentsQuery(reelId, parentCommentId, page, pageSize, userId);
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

        [HttpPost("{reelId:long}/like")]
        public async Task<IActionResult> ToggleLikeReel(long reelId, CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new ToggleLikeReelCommand(userId, reelId);
            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpPost("{reelId:long}/comments")]
        public async Task<IActionResult> CreateReelComment(
            long reelId,
            [FromBody] CreateReelCommentRequest request,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new CreateReelCommentCommand(
                reelId,
                userId,
                request.Content,
                request.ParentCommentId,
                request.RepliedUserId);

            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess
                ? CreatedAtAction(nameof(GetReelById), new { reelId = reelId }, result.Value)
                : HandleFailure(result);
        }

        [HttpPost("{reelId:long}/view")]
        public async Task<IActionResult> RecordReelView(long reelId, CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new RecordReelViewCommand(reelId, userId);
            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? Ok() : HandleFailure(result);
        }

        [HttpDelete("{reelId:long}")]

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
