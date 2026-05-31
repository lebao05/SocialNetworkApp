using Application;
using Application.Posts.Commands.CreateComment;
using Application.Posts.Commands.CreatePost;
using Application.Posts.Commands.ReactToComment;
using Application.Posts.Commands.ReactToPost;
using Application.Posts.Commands.SavePost;
using Application.Posts.Commands.UnsavePost;
using Application.Posts.Commands.UpdatePost;
using Application.Posts.Queries.GetComments;
using Application.Posts.Queries.GetPost;
using Application.Posts.Queries.GetPostMediasByGroup;
using Application.Posts.Queries.GetPostMediasByUser;
using Application.Posts.Queries.GetPostsByGroup;
using Application.Posts.Queries.GetPostsByPerson;
using Application.Posts.Queries.GetPossibleTags;
using Application.Posts.Queries.GetFeedPosts;
using Application.Posts.Commands.MarkLatestFeedAsSeen;
using Application.Abstractions;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;
using Presentation.Contracts.Post;
using System.Security.Claims;

namespace Presentation.Controllers
{
    [Authorize]
    [Route("api/posts")]
    public class PostController : ApiController
    {
        public PostController(ISender sender) : base(sender)
        {
        }

        [HttpPost("create")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreatePost(
            [FromForm] CreatePostRequest request,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var attachments = request.Attachments
                .Where(file => file.Length > 0)
                .Select(file => new PostAttachment(
                    file.OpenReadStream(),
                    file.FileName,
                    file.ContentType,
                    file.Length))
                .ToList();

            try
            {
                var command = new CreatePostCommand(
                    userId,
                    request.GroupId,
                    request.Content,
                    request.Visibility,
                    request.SharePostId,
                    request.LocationTag,
                    request.FeelingActivity,
                    request.TaggedUserIds,
                    attachments
                );

                var result = await _sender.Send(command, cancellationToken);

                return result.IsSuccess ? CreatedAtAction(nameof(GetPost), new { id = result.Value }, result.Value) : HandleFailure(result);
            }
            finally
            {
                foreach (var attachment in attachments)
                {
                    await attachment.Stream.DisposeAsync();
                }
            }
        }

        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetPost(long id, CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Guid? userId = null;

            if (Guid.TryParse(userIdClaim, out var parsedUserId))
            {
                userId = parsedUserId;
            }

            var query = new GetPostQuery(id, userId);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpGet("group/{groupId:long}")]
        public async Task<IActionResult> GetPostsByGroup(
            long groupId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool onlyMine = false,
            CancellationToken cancellationToken = default)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Guid? currentUserId = null;
            if (Guid.TryParse(userIdClaim, out var parsedUserId))
            {
                currentUserId = parsedUserId;
            }

            if (onlyMine && !currentUserId.HasValue)
            {
                return Unauthorized();
            }

            var query = new GetPostsByGroupQuery(groupId, page, pageSize, currentUserId, onlyMine);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpGet("group/{groupId:long}/medias")]
        public async Task<IActionResult> GetPostMediasByGroup(
            long groupId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string type = "",
            CancellationToken cancellationToken = default)
        {
            var query = new GetPostMediasByGroupQuery(groupId, page, pageSize, type);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpGet("user/{userId:guid}")]
        public async Task<IActionResult> GetPostsByUser(
            Guid userId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            CancellationToken cancellationToken = default)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Guid? currentUserId = null;
            if (Guid.TryParse(userIdClaim, out var parsedUserId))
            {
                currentUserId = parsedUserId;
            }

            var query = new GetPostsByPersonQuery(userId, page, pageSize, currentUserId);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpGet("user/{userId:guid}/medias")]
        public async Task<IActionResult> GetPostMediasByUser(
            Guid userId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string type = "",
            CancellationToken cancellationToken = default)
        {
            var query = new GetPostMediasByUserQuery(userId, page, pageSize, type);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> UpdatePost(
            long id,
            [FromBody] UpdatePostRequest request,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new UpdatePostCommand(
                id,
                userId,
                request.Content,
                request.Visibility,
                request.LocationTag,
                request.FeelingActivity
            );

            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? NoContent() : HandleFailure(result);
        }

        [HttpPost("{id:long}/react")]
        public async Task<IActionResult> ReactToPost(
            long id,
            [FromBody] ReactToPostRequest request,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new ReactToPostCommand(
                id,
                userId,
                request.ReactionType);

            var result = await _sender.Send(command, cancellationToken);
            return result.IsSuccess ? Ok() : HandleFailure(result);
        }

        [HttpPost("comments/{id:long}/react")]
        public async Task<IActionResult> ReactToComment(
            long id,
            [FromBody] ReactToCommentRequest request,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new ReactToCommentCommand(
                id,
                userId,
                request.ReactionType);

            var result = await _sender.Send(command, cancellationToken);
            return result.IsSuccess ? Ok() : HandleFailure(result);
        }

        [HttpPost("{postId:long}/comments")]
        public async Task<IActionResult> CreateComment(
            long postId,
            [FromBody] CreateCommentRequest request,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new CreateCommentCommand(
                postId,
                userId,
                request.Content,
                request.ParentCommentId,
                request.RepliedUserId);

            var result = await _sender.Send(command, cancellationToken);
            return result.IsSuccess ? CreatedAtAction(nameof(GetPost), new { id = result.Value }, result.Value) : HandleFailure(result);
        }

        [HttpGet("{postId:long}/comments")]
        public async Task<IActionResult> GetComments(
            long postId,
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

            var query = new GetCommentsQuery(postId, parentCommentId, page, pageSize, userId);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpPost("{id:long}/save")]
        public async Task<IActionResult> SavePost(
            long id,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new SavePostCommand(id, userId);
            var result = await _sender.Send(command, cancellationToken);
            return result.IsSuccess ? Ok() : HandleFailure(result);
        }

        [HttpDelete("{id:long}/save")]
        public async Task<IActionResult> UnsavePost(
            long id,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new UnsavePostCommand(id, userId);
            var result = await _sender.Send(command, cancellationToken);
            return result.IsSuccess ? Ok() : HandleFailure(result);
        }

        [HttpGet("tags/search")]
        public async Task<IActionResult> GetPossibleTags(
            [FromQuery] string? searchQuery = null,
            [FromQuery] long? groupId = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            CancellationToken cancellationToken = default)
        {
            var query = new GetPossibleTagsQuery(searchQuery, groupId, page, pageSize);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpPost("feed/generate")]
        public async Task<IActionResult> Generate(
            [FromServices] IFeedGenerator feedGenerator,
            CancellationToken cancellationToken = default)
        {
            if (!TryGetUserId(out var userId))
            {
                return Unauthorized();
            }

            var generatedCount = await feedGenerator.GenerateAsync(
                userId,
                cancellationToken);

            return Ok(new { GeneratedCount = generatedCount });
        }

        [HttpGet("feed/posts")]
        public async Task<IActionResult> GetPosts(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] bool isRefresh = false,
            CancellationToken cancellationToken = default)
        {
            if (!TryGetUserId(out var userId))
            {
                return Unauthorized();
            }

            var query = new GetFeedPostsQuery(userId, page, pageSize, isRefresh);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpPost("feed/seen")]
        public async Task<IActionResult> MarkAsSeen([FromBody] List<long> feedIds, CancellationToken cancellationToken = default)
        {
            if (!TryGetUserId(out var userId))
            {
                return Unauthorized();
            }

            var command = new MarkLatestFeedAsSeenCommand(userId, feedIds);
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
