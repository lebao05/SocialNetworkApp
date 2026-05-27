using Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace Presentation.Contracts.Post
{
    public sealed class CreatePostRequest
    {
        public long? GroupId { get; init; } = null;
        public string? Content { get; init; } = null;
        public PostVisibility Visibility { get; init; } = PostVisibility.Public;
        public long? SharePostId { get; init; } = null;
        public string? LocationTag { get; init; } = null;
        public Feeling? FeelingActivity { get; init; } = null;
        public List<Guid> TaggedUserIds { get; init; } = new();
        public List<IFormFile> Attachments { get; init; } = new();
    }
}
