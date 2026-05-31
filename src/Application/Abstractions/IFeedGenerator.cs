namespace Application.Abstractions
{
    public interface IFeedGenerator
    {
        Task<int> GenerateAsync(Guid userId, CancellationToken cancellationToken = default);
    }
}
