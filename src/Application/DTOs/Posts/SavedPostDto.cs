namespace Application.DTOs.Posts
{
    public sealed record SavedPostDto(
        long Id,
        DateTime SavedAt,
        PostDto Post
    );
}
