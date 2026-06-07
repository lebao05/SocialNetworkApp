namespace Application.Reels.Commands.ToggleLikeReel
{
    public sealed record ToggleLikeReelResponse(
        bool IsLiked,
        int LikeCount
    );
}
