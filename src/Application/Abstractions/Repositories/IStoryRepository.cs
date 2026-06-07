using Application.DTOs.Stories;
using Application.Shared;
using Domain.Entities;

namespace Application.Abstractions.Repositories;

public interface IStoryRepository
{
    Task<Story?> GetByIdAsync(long id, CancellationToken cancellationToken = default);
    Task<Story?> GetByIdWithSeenAsync(long id, Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Story>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<List<Story>> GetActiveStoriesByUserIdsAsync(IEnumerable<Guid> userIds, CancellationToken cancellationToken = default);
    Task<List<Story>> GetOwnActiveStoriesAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<PagedList<StoryTimelineUserPageItem>> GetTimelineUsersPagedAsync(Guid userId, int page, int pageSize, CancellationToken cancellationToken = default);
    Task<StorySeen?> GetStorySeenAsync(long storyId, Guid userId, CancellationToken cancellationToken = default);
    Task<StoryReaction?> GetReactionAsync(long storyId, Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Guid>> GetFriendIdsAsync(Guid userId, CancellationToken cancellationToken = default);
    void Add(Story story);
    void AddStorySeen(StorySeen storySeen);
    void AddReaction(StoryReaction reaction);
    void RemoveReaction(StoryReaction reaction);
    void Delete(Story story);
}
