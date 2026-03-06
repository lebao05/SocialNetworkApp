using Domain.Shared;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Presentation.Shared;

namespace Presentation.Abstractions
{
    [ApiController]
    public abstract class ApiController : ControllerBase
    {
        protected readonly ISender _sender;

        protected ApiController(ISender sender)
        {
            _sender = sender;
        }

        protected IActionResult HandleFailure(Result result) =>
            result switch
            {
                { IsSuccess: true } => throw new InvalidOperationException(),
                IValidationResult validationResult =>
                    BadRequest(
                        new CustomProblemDetails(
                            "Validation Error", StatusCodes.Status400BadRequest,
                            result.Error,
                            validationResult.Errors)),
                _ =>
                    BadRequest(
                        new CustomProblemDetails(
                            "Bad Request",
                            StatusCodes.Status400BadRequest,
                            result.Error))
            };
    }
}