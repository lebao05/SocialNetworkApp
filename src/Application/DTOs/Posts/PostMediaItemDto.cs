namespace Application.DTOs.Posts
{
    public sealed record PostMediaItemDto(
        long Id,
        long PostId,
        string MediaType,
        string MediaUrl,
        string? ThumbnailUrl,
        string? Metadata,
        DateTime UploadedAt
    );
}
