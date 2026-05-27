namespace Application.DTOs.Posts
{
    public sealed record PostMediaDto(
        long Id,
        string MediaType,
        string MediaUrl,
        string? ThumbnailUrl,
        string? Metadata,
        DateTime UploadedAt
    );
}
