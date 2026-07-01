using Application.Stories.Commands.CreateStory;
using Application.Stories.Commands.DeleteStory;
using Application.Stories.Commands.MarkStoryAsSeen;
using Application.Stories.Commands.ToggleStoryLike;
using Application.Stories.Commands.UploadStoryMedia;
using Application.Stories.Queries.GetStoriesByUserId;
using Application.Stories.Queries.GetStoryTimeline;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;
using Presentation.Contracts.Story;
using System.Security.Claims;

namespace Presentation.Controllers;

[Authorize]
[Route("api/stories")]
public class StoryController : ApiController
{
    public StoryController(ISender sender) : base(sender)
    {
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateStory(
        [FromBody] CreateStoryRequest request,
        CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var command = new CreateStoryCommand(
            userId,
            request.MediaUrl,
            request.MediaType,
            request.BackgroundGradient,
            request.TextContent,
            request.TextColor,
            request.TextStyle,
            request.TextPositionX,
            request.TextPositionY,
            request.FontFamily);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new { id = result.Value })
            : HandleFailure(result);
    }

    [HttpGet("user/{userId:guid}")]
    public async Task<IActionResult> GetStoriesByUserId(Guid userId, CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid? currentUserId = null;

        if (Guid.TryParse(userIdClaim, out var parsedUserId))
        {
            currentUserId = parsedUserId;
        }

        var query = new GetStoriesByUserIdQuery(userId, currentUserId);
        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
    }

    [HttpGet("timeline")]
    public async Task<IActionResult> GetStoryTimeline(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var query = new GetStoryTimelineQuery(userId, page, pageSize);
        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
    }

    [HttpDelete("{storyId:long}")]
    public async Task<IActionResult> DeleteStory(long storyId, CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var command = new DeleteStoryCommand(userId, storyId);
        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess ? Ok() : HandleFailure(result);
    }

    [HttpPost("{storyId:long}/like")]
    public async Task<IActionResult> ToggleStoryLike(long storyId, CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var command = new ToggleStoryLikeCommand(userId, storyId);
        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
    }

    [HttpPost("{storyId:long}/seen")]
    public async Task<IActionResult> MarkStoryAsSeen(long storyId, CancellationToken cancellationToken)
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

    [HttpPost("upload-media")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UploadStoryMedia(
        [FromForm] IFormFile file,
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
        var command = new UploadStoryMediaCommand(userId, stream, file.FileName, file.ContentType);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess ? Ok(new { Url = result.Value }) : HandleFailure(result);
    }
}