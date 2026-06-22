using Application.Messages.Commands.InvokeMessage;
using Application.Messages.Commands.MarkMessagesAsSeen;
using Application.Messages.Commands.ReactToMessage;
using Application.Messages.Commands.SendMessage;
using Application.Messages.Commands.TogglePinMessage;
using Application.Messages.Commands.UpdateMessage;
using Application.Messages.Queries.GetMessagesAround;
using Application.Messages.Queries.GetFilesByConversationId;
using Application.Messages.Queries.GetPinnedMessages;
using Application.Messages.Queries.SearchMessages;
using Infrastructure.SignalR;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Presentation.Abstractions;
using Presentation.Contracts.Message;
using System.Security.Claims;

namespace Presentation.Controllers
{
    [Route("api/messages")]
    [Authorize]
    public class MessageController : ApiController
    {
        private readonly IHubContext<ChatHub> _hubContext;

        public MessageController(ISender sender, IHubContext<ChatHub> hubContext)
            : base(sender)
        {
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetMessages(
            [FromQuery] long conversationId,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken cancellationToken = default)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

            pageSize = Math.Clamp(pageSize, 1, 100);
            pageNumber = Math.Max(pageNumber, 1);

            var query = new GetMessagesAroundQuery(
                Guid.Parse(userIdString),
                conversationId,
                null,
                "down",
                pageSize);

            var result = await _sender.Send(query, cancellationToken);

            if (result.IsFailure)
                return BadRequest(result.Error);

            var v = result.Value;
            return Ok(new MessagesAroundResponse(v.Messages, v.HasMoreUp, v.HasMoreDown));
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchMessages(
            [FromQuery] long conversationId,
            [FromQuery] string query,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken cancellationToken = default)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

            var searchQuery = new SearchMessagesQuery(
                Guid.Parse(userIdString),
                conversationId,
                query,
                pageNumber,
                pageSize);

            var result = await _sender.Send(searchQuery, cancellationToken);

            if (result.IsFailure)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }

        [HttpGet("around")]
        public async Task<IActionResult> GetMessagesAround(
            [FromQuery] long conversationId,
            [FromQuery] long? anchorMessageId,
            [FromQuery] string direction = "up",
            [FromQuery] int size = 20,
            CancellationToken cancellationToken = default)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

            var query = new GetMessagesAroundQuery(
                Guid.Parse(userIdString),
                conversationId,
                anchorMessageId,
                direction,
                size);

            var result = await _sender.Send(query, cancellationToken);

            if (result.IsFailure)
                return BadRequest(result.Error);

            var v = result.Value;
            return Ok(new MessagesAroundResponse(v.Messages, v.HasMoreUp, v.HasMoreDown));
        }

        [HttpGet("{conversationId:long}/files")]
        public async Task<IActionResult> GetFilesByConversation(
            long conversationId,
            [FromQuery] bool isMedia = true,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken cancellationToken = default)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

            pageSize = Math.Clamp(pageSize, 1, 50);
            pageNumber = Math.Max(pageNumber, 1);

            var query = new GetFilesByConversationIdQuery(
                Guid.Parse(userIdString),
                conversationId,
                isMedia,
                pageNumber,
                pageSize);

            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpGet("{conversationId:long}/pinned")]
        public async Task<IActionResult> GetPinnedMessages(
            long conversationId,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken cancellationToken = default)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

            pageSize = Math.Clamp(pageSize, 1, 100);
            pageNumber = Math.Max(pageNumber, 1);

            var query = new GetPinnedMessagesQuery(
                Guid.Parse(userIdString),
                conversationId,
                pageNumber,
                pageSize);

            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpPost("{conversationId:long}/mark-seen")]
        public async Task<IActionResult> MarkMessagesAsSeen(
            long conversationId,
            [FromBody] MarkMessagesAsSeenRequest request,
            CancellationToken cancellationToken)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

            var command = new MarkMessagesAsSeenCommand(
                conversationId,
                Guid.Parse(userIdString),
                request.LastReadMessageId);

            var result = await _sender.Send(command, cancellationToken);

            if (result.IsFailure) return HandleFailure(result);

            await _hubContext.Clients.Group(conversationId.ToString())
                .SendAsync("MessagesSeen", new
                {
                    conversationId,
                    userId = userIdString,
                    lastReadMessageId = request.LastReadMessageId
                }, cancellationToken);

            return NoContent();
        }

        [HttpPost("{messageId}/react")]
        public async Task<IActionResult> ReactToMessage(
            long messageId,
            [FromBody] ReactToMessageRequest request,
            CancellationToken cancellationToken)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

            var command = new ReactToMessageCommand(
                messageId,
                Guid.Parse(userIdString),
                request.ReactionType);

            var result = await _sender.Send(command, cancellationToken);

            if (result.IsFailure) return HandleFailure(result);

            await _hubContext.Clients.Group(result.Value.ConversationId.ToString())
                .SendAsync("MessageReactionUpdated", result.Value, cancellationToken);

            return Ok(result.Value);
        }

        [HttpDelete("{messageId}/revoke")]
        public async Task<IActionResult> RevokeMessage(
            long messageId,
            CancellationToken cancellationToken)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

            var command = new InvokeMessageCommand(messageId, Guid.Parse(userIdString));

            var result = await _sender.Send(command, cancellationToken);

            if (result.IsFailure) return BadRequest(result.Error);

            return Ok(result.Value);
        }

        [HttpPatch("{messageId}/pin")]
        public async Task<IActionResult> TogglePinMessage(
            long messageId,
            CancellationToken cancellationToken)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

            var command = new TogglePinMessageCommand(messageId, Guid.Parse(userIdString));

            var result = await _sender.Send(command, cancellationToken);

            if (result.IsFailure) return HandleFailure(result);

            return Ok(result.Value);
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> SendMessage(
            [FromForm] long conversationId,
            [FromForm] string? content,
            [FromForm] long? replyToMessageId,
            IFormFileCollection? files,
            CancellationToken cancellationToken)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            List<SendMessageFile>? sendFiles = null;
            if (files?.Any() == true)
            {
                sendFiles = files.Select(f => new SendMessageFile(
                    f.OpenReadStream(),
                    f.FileName,
                    f.ContentType,
                    f.Length
                )).ToList();
            }

            var command = new SendMessageCommand(
                conversationId,
                Guid.Parse(userId),
                content,
                sendFiles,
                replyToMessageId
            );

            var result = await _sender.Send(command, cancellationToken);

            if (result.IsFailure) return BadRequest(result.Error);

            foreach (var msg in result.Value)
            {
                await _hubContext.Clients.Group(conversationId.ToString())
                    .SendAsync("ReceiveMessage", msg, cancellationToken);
            }

            return Ok(result.Value);
        }

        [HttpPut("{messageId}")]
        public async Task<IActionResult> UpdateMessage(
            long messageId,
            [FromBody] UpdateMessageRequest request,
            CancellationToken cancellationToken)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var command = new UpdateMessageCommand(
                messageId,
                Guid.Parse(userId),
                request.Content
            );

            var result = await _sender.Send(command, cancellationToken);

            if (result.IsFailure) return BadRequest(result.Error);

            var updatedMessage = result.Value;
            await _hubContext.Clients.Group(updatedMessage.ConversationId.ToString())
                .SendAsync("MessageUpdated", updatedMessage, cancellationToken);

            return Ok(updatedMessage);
        }

        [HttpPost("typing")]
        public async Task<IActionResult> Typing(
            [FromQuery] long conversationId,
            CancellationToken cancellationToken)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            await _hubContext.Clients.Group(conversationId.ToString())
                .SendAsync("UserTyping", new { userId, conversationId }, cancellationToken);

            return NoContent();
        }

        [HttpPost("untyping")]
        public async Task<IActionResult> UntypingEnded(
            [FromQuery] long conversationId,
            CancellationToken cancellationToken)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            await _hubContext.Clients.Group(conversationId.ToString())
                .SendAsync("UserUntyping", new { userId, conversationId }, cancellationToken);

            return NoContent();
        }
    }
}
