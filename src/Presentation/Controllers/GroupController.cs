using Application.Groups.Commands.AssignGroupRole;
using Application.Groups.Commands.CreateGroup;
using Application.Groups.Commands.ExecuteReportedContent;
using Application.Groups.Commands.ReportGroupPost;
using Application.Groups.Commands.UploadGroupCoverPhoto;
using Application.Groups.Commands.JoinGroup;
using Application.Groups.Commands.LeaveGroup;
using Application.Groups.Commands.ReviewGroupJoinRequest;
using Application.Groups.Commands.ReviewGroupPost;
using Application.Groups.Commands.UpdateGroup;
using Application.Groups.Commands.CreateGroupRule;
using Application.Groups.Commands.UpdateGroupRule;
using Application.Groups.Commands.DeleteGroupRule;
using Application.Groups.Queries.GetGroupDetail;
using Application.Groups.Queries.GetGroupInsights;
using Application.Groups.Queries.GetGroupJoinRequests;
using Application.Groups.Queries.GetGroupMembers;
using Application.Groups.Queries.GetGroupRules;
using Application.Groups.Queries.GetReportedContents;
using Application.Groups.Queries.GetGroups;
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

        [HttpGet("{groupId:long}")]
        public async Task<IActionResult> GetGroupDetail(
            long groupId,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var query = new GetGroupDetailQuery(groupId, userId);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpGet("{groupId:long}/insights")]
        public async Task<IActionResult> GetGroupInsights(
            long groupId,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            CancellationToken cancellationToken = default)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var query = new GetGroupInsightsQuery(groupId, userId, fromDate, toDate);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
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

        [HttpPut("{groupId:long}")]
        public async Task<IActionResult> UpdateGroup(
            long groupId,
            [FromBody] UpdateGroupRequest request,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out var requesterUserId))
            {
                return Unauthorized();
            }

            var groupPrivacy = request.IsPrivate ? GroupPrivacyType.Private : GroupPrivacyType.Public;
            var command = new UpdateGroupCommand(
                requesterUserId,
                groupId,
                request.Name,
                request.Description,
                groupPrivacy,
                request.IsPostApprovalRequired,
                request.IsGroupJoinApprovalRequired,
                request.AllowAnonymousPost);

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

        [HttpPost("{groupId:long}/join")]
        public async Task<IActionResult> JoinGroup(
            long groupId,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new JoinGroupCommand(userId, groupId);
            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? Ok() : HandleFailure(result);
        }

        [HttpDelete("{groupId:long}/leave")]
        public async Task<IActionResult> LeaveGroup(
            long groupId,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new LeaveGroupCommand(userId, groupId);
            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? Ok() : HandleFailure(result);
        }

        [HttpPost("{groupId:long}/join-requests/{requestId:long}/review")]
        public async Task<IActionResult> ReviewJoinRequest(
            long groupId,
            long requestId,
            [FromBody] Contracts.Group.ReviewGroupJoinRequest request,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out var requesterUserId))
            {
                return Unauthorized();
            }

            var command = new ReviewGroupJoinRequestCommand(requesterUserId, groupId, requestId, request.Approve);
            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? Ok() : HandleFailure(result);
        }

        [HttpGet("{groupId:long}/join-requests")]
        public async Task<IActionResult> GetGroupJoinRequests(
            long groupId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? searchTerm = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] bool? haveAvatar = null,
            CancellationToken cancellationToken = default)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out var requesterUserId))
            {
                return Unauthorized();
            }

            var query = new GetGroupJoinRequestsQuery(requesterUserId, groupId, page, pageSize, searchTerm, fromDate, haveAvatar);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpPost("{groupId:long}/posts/{postId:long}/review")]
        public async Task<IActionResult> ReviewGroupPost(
            long groupId,
            long postId,
            [FromBody] ReviewGroupPostRequest request,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out var requesterUserId))
            {
                return Unauthorized();
            }

            var command = new ReviewGroupPostCommand(requesterUserId, groupId, postId, request.Approve);
            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? Ok() : HandleFailure(result);
        }

        [HttpPost("{groupId:long}/posts/{postId:long}/reports")]
        public async Task<IActionResult> ReportGroupPost(
            long groupId,
            long postId,
            [FromBody] ReportGroupPostRequest request,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out var reporterId))
            {
                return Unauthorized();
            }

            if (!Enum.TryParse<GroupReportReason>(request.Reason, true, out var reason))
            {
                return BadRequest("Invalid reason. Valid values are: Spam, Harassment, HateSpeech, Violence, Misinformation, NudityOrSexual, IntellectualProperty, Other.");
            }

            var command = new ReportGroupPostCommand(
                reporterId,
                groupId,
                postId,
                reason,
                request.AdditionalDetail);

            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? Ok() : HandleFailure(result);
        }

        [HttpPost("{groupId:long}/reports/{reportId:long}/execute")]
        public async Task<IActionResult> ExecuteReportedContent(
            long groupId,
            long reportId,
            [FromBody] ExecuteReportedContentRequest request,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out var reviewerUserId))
            {
                return Unauthorized();
            }

            var command = new ExecuteReportedContentCommand(
                reviewerUserId,
                groupId,
                reportId,
                request.HidePost,
                request.ReviewNote);

            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? Ok() : HandleFailure(result);
        }

        [HttpGet("{groupId:long}/reports")]
        public async Task<IActionResult> GetReportedContents(
            long groupId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? status = null,
            CancellationToken cancellationToken = default)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out var requesterUserId))
            {
                return Unauthorized();
            }

            GroupReportStatus? reportStatus = null;
            if (!string.IsNullOrWhiteSpace(status))
            {
                if (!Enum.TryParse<GroupReportStatus>(status, true, out var parsedStatus))
                {
                    return BadRequest("Invalid status. Valid values are: Pending, Reviewed, Dismissed.");
                }

                reportStatus = parsedStatus;
            }

            var query = new GetReportedContentsQuery(requesterUserId, groupId, page, pageSize, reportStatus);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpGet("{groupId:long}/members")]
        public async Task<IActionResult> GetGroupMembers(
            long groupId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? role = null,
            CancellationToken cancellationToken = default)
        {
            GroupMemberRole? groupRole = null;
            if (!string.IsNullOrWhiteSpace(role))
            {
                if (!Enum.TryParse<GroupMemberRole>(role, true, out var parsedRole))
                {
                    return BadRequest("Invalid role. Valid values are: Member, Admin, Moderator.");
                }

                groupRole = parsedRole;
            }

            var query = new GetGroupMembersQuery(groupId, page, pageSize, searchTerm, groupRole);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpGet("{groupId:long}/rules")]
        public async Task<IActionResult> GetGroupRules(
            long groupId,
            CancellationToken cancellationToken)
        {
            var query = new GetGroupRulesQuery(groupId);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetGroups(
            [FromQuery] bool isJoining,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12,
            [FromQuery] string? searchTerm = null,
            CancellationToken cancellationToken = default)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var query = new GetGroupsQuery(userId, isJoining, page, pageSize, searchTerm);
            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpPost("{groupId:long}/rules")]
        public async Task<IActionResult> CreateGroupRule(
            long groupId,
            [FromBody] CreateGroupRuleRequest request,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new CreateGroupRuleCommand(userId, groupId, request.Title, request.Description);
            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? StatusCode(StatusCodes.Status201Created) : HandleFailure(result);
        }

        [HttpPut("{groupId:long}/rules/{ruleId:long}")]
        public async Task<IActionResult> UpdateGroupRule(
            long groupId,
            long ruleId,
            [FromBody] UpdateGroupRuleRequest request,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new UpdateGroupRuleCommand(userId, groupId, ruleId, request.Title, request.Description);
            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? Ok() : HandleFailure(result);
        }

        [HttpDelete("{groupId:long}/rules/{ruleId:long}")]
        public async Task<IActionResult> DeleteGroupRule(
            long groupId,
            long ruleId,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new DeleteGroupRuleCommand(userId, groupId, ruleId);
            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? Ok() : HandleFailure(result);
        }
    }
}
