using Domain.Shared;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Shared
{
    public class CustomProblemDetails : ProblemDetails
    {
        public IDictionary<string, object?> Extensions { get; } = new Dictionary<string, object?>();

        public CustomProblemDetails(
            string title,
            int status,
            Error error,
            Error[]? errors = null)
        {
            Title = title;
            Status = status;
            Type = error.Code;
            Detail = error.Message;
            Extensions[nameof(errors)] = errors;
        }
    }
}