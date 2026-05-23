namespace Application.Abstractions
{
    public interface IFeedGenerator
    {
        Task<int> GenerateAsync(Guid userId, int candidateLimit = 500, int feedItemLimit = 100, CancellationToken cancellationToken = default);
    }
}
