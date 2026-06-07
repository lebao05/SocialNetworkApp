using Application.Stories.Commands.CreateStory;
using Application.Stories.Commands.DeleteStory;
using Application.Stories.Commands.ToggleStoryLike;
using Application.Stories.Queries.GetStoriesByUserId;
using MediatR;
using Microsoft.AspNetCore.Authorization;
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
}