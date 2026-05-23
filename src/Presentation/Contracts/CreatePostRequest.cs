using Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace Presentation.Contracts
{
    public sealed class CreatePostRequest
    {
        public long? GroupId { get; init; }
        public string? Content { get; init; }
        public PostVisibility Visibility { get; init; }
        public long? SharePostId { get; init; }
        public string? LocationTag { get; init; }
        public string? FeelingActivity { get; init; }
        public List<Guid> TaggedUserIds { get; init; } = new();
        public List<IFormFile> Attachments { get; init; } = new();
    }
}
