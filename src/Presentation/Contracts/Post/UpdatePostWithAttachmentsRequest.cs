using Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace Presentation.Contracts.Post
{
    public sealed class UpdatePostWithAttachmentsRequest
    {
        public string? Content { get; set; }
        public PostVisibility? Visibility { get; set; }
        public string? LocationTag { get; set; }
        public Feeling? FeelingActivity { get; set; }
        public List<long>? RetainMediaIds { get; set; }
        public List<IFormFile>? NewAttachments { get; set; }
    }
}
