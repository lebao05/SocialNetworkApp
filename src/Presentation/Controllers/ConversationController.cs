using Application.Abstractions.Repositories;
using Application.Abstractions.SignalR;
using Application.Conversations.Commands.AddMemberToConversation;
using Application.Conversations.Commands.CreateConversation;
using Application.Conversations.Commands.RemoveMemberFromConversation;
using Application.Conversations.Commands.ToggleNotifications;
using Application.Conversations.Commands.LeaveConversation;
using Application.Conversations.Commands.AssignAdminRole;
using Application.Conversations.Commands.RevokeAdminRole;
using Application.Conversations.Commands.KickMemberOut;
using Application.Conversations.Commands.UpdateConversation;
using Application.Conversations.Commands.UploadConversationImage;
using Application.Conversations.Queries.GetConversationDetail;
using Application.Conversations.Queries.GetConversationMembers;
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
using Microsoft.AspNetCore.Http;

namespace Presentation.Controllers;

[Route("api/conversation")]
[Authorize]
public class ConversationController : ApiController
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IUserRepository _userRepository;
    private readonly IPresenceTracker _presenceTracker;
    private readonly IChatHubNotifier _hubNotifier;

    public ConversationController(
        ISender sender,
        IConversationRepository conversationRepository,
        IUserRepository userRepository,
        IPresenceTracker presenceTracker,
        IChatHubNotifier hubNotifier) : base(sender)
    {
        _conversationRepository = conversationRepository;
        _userRepository = userRepository;
        _presenceTracker = presenceTracker;
        _hubNotifier = hubNotifier;
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

        Result<ConversationDetailDto> result = await _sender.Send(command, cancellationToken);

        if (result.IsFailure)
        {
            return HandleFailure(result);
        }

        return Ok(result.Value);
    }

    [HttpPost("{conversationId:long}/members")]
    public async Task<IActionResult> AddMember(
        long conversationId,
        [FromBody] AddMemberToConversationRequest request,
        CancellationToken cancellationToken)
    {
        var adminId = ClaimsPrincipalExtensions.GetUserId(User);

        var command = new AddMemberToConversationCommand(
            conversationId,
            adminId,
            request.UserIdToAdd
        );

       var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess ? Ok(result) : HandleFailure(result);
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
        [FromQuery] bool groupsOnly = false,
        [FromQuery] bool unreadOnly = false,
        CancellationToken cancellationToken = default)
    {
        pageSize = Math.Clamp(pageSize, 1, 100);
        pageNumber = Math.Max(pageNumber, 1);

        var userId = ClaimsPrincipalExtensions.GetUserId(User);

        var query = new GetConversationsQuery(userId, pageSize, pageNumber, groupsOnly, unreadOnly);

        Result<List<ConversationDetailDto>> result = await _sender.Send(query, cancellationToken);

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
    public async Task<IActionResult> LeaveConversation(
        long conversationId,
        CancellationToken cancellationToken)
    {
        var userId = ClaimsPrincipalExtensions.GetUserId(User);

        var command = new LeaveConversationCommand(conversationId, userId);

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

        var command = new AssignAdminRoleCommand(conversationId, ownerId, targetUserId);

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

        var command = new RevokeAdminRoleCommand(conversationId, ownerId, targetUserId);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess ? NoContent() : HandleFailure(result);
    }

    [HttpDelete("{conversationId:long}/kick/{userIdToKick:guid}")]
    public async Task<IActionResult> KickMemberOut(
        long conversationId,
        Guid userIdToKick,
        CancellationToken cancellationToken)
    {
        var requesterId = ClaimsPrincipalExtensions.GetUserId(User);

        var command = new KickMemberOutCommand(conversationId, requesterId, userIdToKick);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess ? NoContent() : HandleFailure(result);
    }

    [HttpGet("{conversationId:long}/members")]
    public async Task<IActionResult> GetConversationMembers(
        long conversationId,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var userId = ClaimsPrincipalExtensions.GetUserId(User);

        var query = new GetConversationMembersQuery(userId, conversationId, pageNumber, pageSize);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new { results = result.Value, totalCount = result.Value.Count })
            : HandleFailure(result);
    }

    [HttpPatch("{conversationId:long}")]
    public async Task<IActionResult> UpdateConversation(
        long conversationId,
        [FromBody] UpdateConversationRequest request,
        CancellationToken cancellationToken)
    {
        var userId = ClaimsPrincipalExtensions.GetUserId(User);

        var command = new UpdateConversationCommand(
            conversationId,
            userId,
            request.Name,
            request.Theme,
            request.DefaultReaction
        );

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
    }

    [HttpPost("{conversationId:long}/image")]
    public async Task<IActionResult> UploadConversationImage(
        long conversationId,
        IFormFile file,
        CancellationToken cancellationToken)
    {
        var userId = ClaimsPrincipalExtensions.GetUserId(User);

        if (file == null || file.Length == 0)
            return BadRequest("File is empty.");

        using var stream = file.OpenReadStream();
        var command = new UploadConversationImageCommand(conversationId, userId, stream, file.FileName);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess ? Ok(new { Url = result.Value }) : HandleFailure(result);
    }
}