namespace Application.Abstractions
{
    public sealed record UploadedVideoResult(
        string VideoUrl,
        string? ThumbnailUrl,
        string? Duration);
}
