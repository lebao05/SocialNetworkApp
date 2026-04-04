using Application.Conversations.Commands;
using Application.Conversations.Commands.CreateConversation;
using Application.Conversations.Commands.ToggleNotifications;
using Domain.Shared;
using Infrastructure.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;
using Presentation.Contracts.Conversations;
using System.Security.Claims;

namespace Presentation.Controllers;

[Route("api/conversations")]
public class ConversationController : ApiController
{
    public ConversationController(ISender sender) : base(sender)
    {
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateConversationRequest request,
        CancellationToken cancellationToken)
    {
        // Assuming your setup uses NameIdentifier for the User's Guid
        var userIdClaim = ClaimsPrincipalExtensions.GetUserId(User);


        var command = new CreateConversationCommand(
            userIdClaim,
            request.ParticipantIds,
            request.Name
        );

        Result<long> result = await _sender.Send(command, cancellationToken);

        if (result.IsFailure)
        {
            return HandleFailure(result);
        }

        // Return 201 Created or 200 OK with the new Conversation ID
        return Ok(result.Value);
    }
    [HttpPatch("{conversationId:long}/notifications")]
    public async Task<IActionResult> ToggleNotifications(
        long conversationId,
        CancellationToken cancellationToken)
    {
        // 1. Get the authenticated User's Guid from the token
        var userId = ClaimsPrincipalExtensions.GetUserId(User);

        // 2. Create the command
        var command = new ToggleNotificationsCommand(
            conversationId,
            userId
        );

        // 3. Send via MediatR
        Result<bool> result = await _sender.Send(command, cancellationToken);

        // 4. Handle response
        if (result.IsFailure)
        {
            return HandleFailure(result);
        }

        // Returns 200 OK with the new status (true/false)
        return Ok(result.Value);
    }
}