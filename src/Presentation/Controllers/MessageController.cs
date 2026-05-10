using Application.Messages.Commands.InvokeMessage;
using Application.Messages.Commands.SendMessage;
using Application.Messages.Commands.UpdateMessage;
using Application.Messages.Queries.GetMessages;
using Application.Messages.Queries.GetMessagesAround;
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

        [HttpGet("search")]
        public async Task<IActionResult> SearchMessages(
            [FromQuery] long conversationId,
            [FromQuery] string query,
            CancellationToken cancellationToken)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

            var userId = Guid.Parse(userIdString);

            var searchQuery = new SearchMessagesQuery(
                userId,
                conversationId,
                query);

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

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request, CancellationToken cancellationToken)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var command = new SendMessageCommand(
                request.ConversationId,
                Guid.Parse(userId),
                request.Content
            );

            var result = await _sender.Send(command, cancellationToken);

            if (result.IsFailure) return BadRequest(result.Error);

            // Notify the conversation group via SignalR
            await _hubContext.Clients.Group(request.ConversationId.ToString())
                .SendAsync("ReceiveMessage", result.Value, cancellationToken);

            return Ok(result.Value);
        }
        [HttpGet]
        public async Task<IActionResult> GetMessages(
        long conversationId,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20)
        {
            var userId = Guid.Parse(User.FindFirst("sub")!.Value);
            pageNumber = Math.Max(pageNumber, 1);
            pageSize = Math.Clamp(pageSize, 1, 50);
            var query = new GetMessagesQuery(
                conversationId,
                userId,
                pageNumber,
                pageSize);

            var result = await _sender.Send(query);

            if (result.IsFailure)
                return BadRequest(result.Error);

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
            // 🔥 Broadcast update to all users in conversation
            await _hubContext.Clients
                .Group(updatedMessage.ToString()) // ❌ WRONG (see fix below)
                .SendAsync("MessageUpdated", updatedMessage, cancellationToken);

            return Ok(updatedMessage);
        }
    }
}