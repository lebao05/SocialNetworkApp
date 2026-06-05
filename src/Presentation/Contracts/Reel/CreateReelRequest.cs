using Microsoft.AspNetCore.Http;

namespace Presentation.Contracts.Reel
{
    public sealed class CreateReelRequest
    {
        public string? Caption { get; init; }
        public string? AudioTitle { get; init; }
        public Domain.Enums.ReelVisibility Visibility { get; init; } = Domain.Enums.ReelVisibility.Public;
        public IFormFile Video { get; init; } = null!;
        public IFormFile? Thumbnail { get; init; }
    }
}
