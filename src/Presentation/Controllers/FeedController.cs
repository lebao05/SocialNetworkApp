using Application.Abstractions;
using Application.Feeds.Commands.MarkLatestFeedAsSeen;
using Application.Feeds.Queries.GetFeedPosts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;
using System.Security.Claims;

namespace Presentation.Controllers
{
    [Authorize]
    [Route("api/feed")]
    public class FeedController : ApiController
    {
        private readonly IFeedGenerator _feedGenerator;

        public FeedController(
            ISender sender,
            IFeedGenerator feedGenerator) : base(sender)
        {
            _feedGenerator = feedGenerator;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> Generate(
            [FromQuery] int candidateLimit = 500,
            [FromQuery] int feedItemLimit = 100,
            CancellationToken cancellationToken = default)
        {
            if (!TryGetUserId(out var userId))
            {
                return Unauthorized();
            }

            var generatedCount = await _feedGenerator.GenerateAsync(
                userId,
                candidateLimit,
                feedItemLimit,
                cancellationToken);

            return Ok(new { GeneratedCount = generatedCount });
        }

        [HttpGet("posts")]
        public async Task<IActionResult> GetPosts(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken cancellationToken = default)
        {
            if (!TryGetUserId(out var userId))
            {
                return Unauthorized();
            }

            var query = new GetFeedPostsQuery(userId, page, pageSize);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpPost("seen/latest")]
        public async Task<IActionResult> MarkLatestAsSeen(CancellationToken cancellationToken = default)
        {
            if (!TryGetUserId(out var userId))
            {
                return Unauthorized();
            }

            var command = new MarkLatestFeedAsSeenCommand(userId, 10);
            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? Ok(new { MarkedCount = result.Value }) : HandleFailure(result);
        }

        private bool TryGetUserId(out Guid userId)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(userIdClaim, out userId);
        }
    }
}

