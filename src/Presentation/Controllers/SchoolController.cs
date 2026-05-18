using Application.Schools.Commands.AddSchool;
using Application.Schools.Commands.DeleteSchool;
using Application.Schools.Commands.UpdateSchool;
using Application.Schools.Queries.GetSchools;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;
using Presentation.Contracts.School;
using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace Presentation.Controllers
{
    [Authorize]
    [Route("api/schools")]
    public class SchoolController : ApiController
    {
        public SchoolController(ISender sender) : base(sender)
        {
        }



        [HttpGet("user/{userId:guid}")]
        public async Task<IActionResult> GetUserSchools(Guid userId, CancellationToken cancellationToken)
        {
            var query = new GetSchoolsQuery(userId);

            var result = await _sender.Send(query, cancellationToken);

            return result.IsSuccess ? Ok(result.Value) : HandleFailure(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddSchool(
            [FromBody] AddSchoolRequest request,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new AddSchoolCommand(
                userId,
                request.Name,
                request.Type,
                request.Degree,
                request.Major,
                request.StartYear,
                request.EndYear
            );

            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? Ok(new { Id = result.Value }) : HandleFailure(result);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> UpdateSchool(
            long id,
            [FromBody] UpdateSchoolRequest request,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new UpdateSchoolCommand(
                id,
                userId,
                request.Name,
                request.Type,
                request.Degree,
                request.Major,
                request.StartYear,
                request.EndYear
            );

            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? NoContent() : HandleFailure(result);
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> DeleteSchool(
            long id,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new DeleteSchoolCommand(id, userId);

            var result = await _sender.Send(command, cancellationToken);

            return result.IsSuccess ? NoContent() : HandleFailure(result);
        }
    }
}
