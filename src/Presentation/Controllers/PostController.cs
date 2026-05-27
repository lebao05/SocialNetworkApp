using Application;
using Application.Posts.Commands.CreatePost;
using Application.Posts.Commands.UpdatePost;
using Application.Posts.Queries.GetPost;
using Application.Posts.Queries.GetPostsByGroup;
using Application.Posts.Queries.GetPostsByPerson;
using Application.Posts.Queries.GetPossibleTags;
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
            var query = new GetPostQuery(id);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpGet("group/{groupId:long}")]
        public async Task<IActionResult> GetPostsByGroup(
            long groupId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            CancellationToken cancellationToken = default)
        {
            var query = new GetPostsByGroupQuery(groupId, page, pageSize);
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
            var query = new GetPostsByPersonQuery(userId, page, pageSize);
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

        
    }
}
