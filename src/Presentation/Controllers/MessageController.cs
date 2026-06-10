using Application.Messages.Commands.InvokeMessage;
using Application.Messages.Commands.SendMessage;
using Application.Messages.Commands.TogglePinMessage;
using Application.Messages.Commands.UpdateMessage;
using Application.Messages.Queries.GetFilesByConversationId;
using Application.Messages.Queries.GetMessagesAround;
using Application.Messages.Queries.GetPinnedMessages;
using Application.Messages.Queries.SearchMessages;
using Infrastructure.SignalR;
using MediatR;
using Microsoft.AspNetCore.Authorization;
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

            var userId = Guid.Parse(userIdString);

            var query = new GetMessagesAroundQuery(
                userId,
                conversationId,
                anchorMessageId,
                direction,
                size);

            var result = await _sender.Send(query, cancellationToken);

            if (result.IsFailure)
                return BadRequest(result.Error);

            return Ok(result.Value);
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

            pageSize = Math.Clamp(pageSize, 1, 50);
            pageNumber = Math.Max(pageNumber, 1);

            var query = new GetPinnedMessagesQuery(
                Guid.Parse(userIdString),
                conversationId,
                pageNumber,
                pageSize);

            var result = await _sender.Send(query, cancellationToken);

            if (result.IsFailure)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }

        [HttpGet("{conversationId:long}/search")]
        public async Task<IActionResult> SearchMessages(
            long conversationId,
            [FromQuery] string q,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken cancellationToken = default)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

            pageSize = Math.Clamp(pageSize, 1, 50);
            pageNumber = Math.Max(pageNumber, 1);

            var query = new SearchMessagesQuery(
                Guid.Parse(userIdString),
                conversationId,
                q ?? string.Empty,
                pageNumber,
                pageSize);

            var result = await _sender.Send(query, cancellationToken);

            if (result.IsFailure)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }

        [HttpGet("{conversationId:long}/files")]
        public async Task<IActionResult> GetFilesByConversationId(
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

            if (result.IsFailure)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }

        [HttpDelete("{messageId}/revoke")]
        public async Task<IActionResult> InvokeMessage(
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

        [HttpPost("{messageId}/pin")]
        public async Task<IActionResult> TogglePinMessage(
            long messageId,
            CancellationToken cancellationToken)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

            var command = new TogglePinMessageCommand(messageId, Guid.Parse(userIdString));

            var result = await _sender.Send(command, cancellationToken);

            if (result.IsFailure) return BadRequest(result.Error);

            return Ok(result.Value);
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> SendMessage(
            [FromForm] SendMessageRequest request,
            CancellationToken cancellationToken)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var files = new List<SendMessageFile>();

            if (request.Files is not null)
            {
                foreach (var file in request.Files)
                {
                    files.Add(new SendMessageFile(
                        file.FileName,
                        file.ContentType,
                        file.Length,
                        file.OpenReadStream()));
                }
            }

            var command = new SendMessageCommand(
                request.ConversationId,
                Guid.Parse(userId),
                request.Content,
                files.Count > 0 ? files : null
            );

            var result = await _sender.Send(command, cancellationToken);

            if (result.IsFailure) return BadRequest(result.Error);

            foreach (var message in result.Value)
            {
                await _hubContext.Clients.Group(request.ConversationId.ToString())
                    .SendAsync("ReceiveMessage", message, cancellationToken);
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
            await _hubContext.Clients
                .Group(updatedMessage.ToString()) 
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
                .SendAsync("UserTyping", userId, cancellationToken);

            return NoContent();
        }

        [HttpPost("typing-ended")]
        public async Task<IActionResult> TypingEnded(
            [FromQuery] long conversationId,
            CancellationToken cancellationToken)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            await _hubContext.Clients.Group(conversationId.ToString())
                .SendAsync("UserTypingEnded", userId, cancellationToken);

            return NoContent();
        }
    }
}