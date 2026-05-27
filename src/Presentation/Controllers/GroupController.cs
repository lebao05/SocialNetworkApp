using Application.Groups.Commands.AssignGroupRole;
using Application.Groups.Commands.CreateGroup;
using Application.Groups.Commands.UploadGroupCoverPhoto;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;
using Presentation.Contracts.Group;
using System.Security.Claims;

namespace Presentation.Controllers
{
    [Authorize]
    [Route("api/groups")]
    public class GroupController : ApiController
    {
        public GroupController(ISender sender) : base(sender)
        {
        }

        [HttpPost]
        public async Task<IActionResult> CreateGroup(
            [FromBody] CreateGroupRequest request,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var groupPrivacy = request.IsPrivate ? GroupPrivacyType.Private : GroupPrivacyType.Public;
            var command = new CreateGroupCommand(userId, request.Name, groupPrivacy);
            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess
                ? Ok(new { Id = result.Value })
                : HandleFailure(result);
        }

        [HttpPut("{groupId:long}/members/{userId:guid}/role")]
        public async Task<IActionResult> AssignGroupRole(
            long groupId,
            Guid userId,
            [FromBody] AssignGroupRoleRequest request,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out var requesterUserId))
            {
                return Unauthorized();
            }

            if (!Enum.TryParse<GroupMemberRole>(request.Role, true, out var role))
            {
                return BadRequest("Invalid role. Valid values are: Member, Admin, Moderator.");
            }

            var command = new AssignGroupRoleCommand(requesterUserId, groupId, userId, role);
            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? Ok() : HandleFailure(result);
        }

        [HttpPost("{groupId:long}/cover-photo")]
        public async Task<IActionResult> UploadGroupCoverPhoto(
            long groupId,
            IFormFile file,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            if (file == null || file.Length == 0)
            {
                return BadRequest("File is empty.");
            }

            using var stream = file.OpenReadStream();
            var command = new UploadGroupCoverPhotoCommand(groupId, userId, stream, file.FileName);
            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? Ok(new { Url = result.Value }) : HandleFailure(result);
        }
    }
}
