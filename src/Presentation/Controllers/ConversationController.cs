using Application.Conversations.Commands.CreateConversation;
using Application.Conversations.Commands.AssignAdminRole;
using Application.Conversations.Commands.KickMemberOut;
using Application.Conversations.Commands.LeaveConversation;
using Application.Conversations.Commands.RemoveMemberFromConversation;
using Application.Conversations.Commands.RevokeAdminRole;
using Application.Conversations.Commands.ToggleNotifications;
using Application.Conversations.Queries.GetConversationDetail;
using Application.Conversations.Queries.SearchConversationsAndFriends;
using Application.Conversations.Queries.GetConversationDetailByUserId;
using Application.Conversations.Queries.GetConversations;
using Application.DTOs.Conversations;
using Application.Shared;
using Domain.Shared;
using Infrastructure.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;
using Presentation.Contracts.Conversations;
using System.Security.Claims;

namespace Presentation.Controllers;

[Route("api/conversation")]
[Authorize]
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
        var userIdClaim = ClaimsPrincipalExtensions.GetUserId(User);

        var command = new CreateConversationCommand(
            userIdClaim,
            request.ParticipantIds,
            request.Name
        );

        Result<ConversationResponse> result = await _sender.Send(command, cancellationToken);

        if (result.IsFailure)
        {
            return HandleFailure(result);
        }

        return Ok(result.Value);
    }

    [HttpPatch("{conversationId:long}/notifications")]
    public async Task<IActionResult> ToggleNotifications(
        long conversationId,
        CancellationToken cancellationToken)
    {
        var userId = ClaimsPrincipalExtensions.GetUserId(User);

        var command = new ToggleNotificationsCommand(
            conversationId,
            userId
        );

        Result<bool> result = await _sender.Send(command, cancellationToken);

        if (result.IsFailure)
        {
            return HandleFailure(result);
        }

        return Ok(result.Value);
    }

    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        pageSize = Math.Clamp(pageSize, 1, 100);
        pageNumber = Math.Max(pageNumber, 1);

        var userId = ClaimsPrincipalExtensions.GetUserId(User);

        var query = new GetConversationsQuery(userId, pageSize, pageNumber);

        Result<List<ConversationResponse>> result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
    }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> GetConversationDetail(long id, CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var query = new GetConversationDetailQuery(id, userId);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
    }

    [HttpGet("user/{targetUserId:guid}")]
    public async Task<IActionResult> GetConversationDetailByUserId(Guid targetUserId, CancellationToken cancellationToken)
    {
        var userId = ClaimsPrincipalExtensions.GetUserId(User);

        var query = new GetConversationDetailByUserIdQuery(userId, targetUserId);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search(
        [FromQuery] string searchTerm,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        var userId = ClaimsPrincipalExtensions.GetUserId(User);

        var query = new SearchConversationsAndFriendsQuery(
            userId,
            searchTerm,
            pageNumber,
            pageSize);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
    }

    [HttpDelete("{conversationId:long}/members/{userIdToRemove:guid}")]
    public async Task<IActionResult> RemoveMember(
        long conversationId,
        Guid userIdToRemove,
        CancellationToken cancellationToken)
    {
        var adminId = ClaimsPrincipalExtensions.GetUserId(User);

        var command = new RemoveMemberFromConversationCommand(
            conversationId,
            adminId,
            userIdToRemove
        );

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess ? NoContent() : HandleFailure(result);
    }

    [HttpDelete("{conversationId:long}/leave")]
    public async Task<IActionResult> Leave(
        long conversationId,
        CancellationToken cancellationToken)
    {
        var userId = ClaimsPrincipalExtensions.GetUserId(User);

        var command = new LeaveConversationCommand(
            conversationId,
            userId
        );

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess ? NoContent() : HandleFailure(result);
    }

    [HttpDelete("{conversationId:long}/kick/{userIdToKick:guid}")]
    public async Task<IActionResult> KickMemberOut(
        long conversationId,
        Guid userIdToKick,
        CancellationToken cancellationToken)
    {
        var adminId = ClaimsPrincipalExtensions.GetUserId(User);

        var command = new KickMemberOutCommand(
            conversationId,
            adminId,
            userIdToKick
        );

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess ? NoContent() : HandleFailure(result);
    }

    [HttpPatch("{conversationId:long}/members/{targetUserId:guid}/assign-admin")]
    public async Task<IActionResult> AssignAdminRole(
        long conversationId,
        Guid targetUserId,
        CancellationToken cancellationToken)
    {
        var ownerId = ClaimsPrincipalExtensions.GetUserId(User);

        var command = new AssignAdminRoleCommand(
            conversationId,
            ownerId,
            targetUserId
        );

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess ? NoContent() : HandleFailure(result);
    }

    [HttpPatch("{conversationId:long}/members/{targetUserId:guid}/revoke-admin")]
    public async Task<IActionResult> RevokeAdminRole(
        long conversationId,
        Guid targetUserId,
        CancellationToken cancellationToken)
    {
        var ownerId = ClaimsPrincipalExtensions.GetUserId(User);

        var command = new RevokeAdminRoleCommand(
            conversationId,
            ownerId,
            targetUserId
        );

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess ? NoContent() : HandleFailure(result);
    }
}