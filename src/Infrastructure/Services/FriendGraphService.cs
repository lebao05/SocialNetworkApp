using Application.Abstractions;
using Application.DTOs.Friends;
using Neo4j.Driver;

namespace Infrastructure.Services
{
    public class FriendGraphService : IFriendGraphService
    {
        private readonly IDriver _driver;
        private readonly string _database;

        public FriendGraphService(IDriver driver, string database)
        {
            _driver = driver;
            _database = database;
        }

        public async Task SyncUserAsync(Guid userId, string userName, string firstName, string lastName, string? avatarUrl)
        {
            const string query = @"
                MERGE (u:User {id: $userId})
                SET u.userName = $userName,
                    u.firstName = $firstName,
                    u.lastName = $lastName,
                    u.fullName = $fullName,
                    u.avatarUrl = $avatarUrl";

            var parameters = new Dictionary<string, object?>
            {
                { "userId", userId.ToString() },
                { "userName", userName },
                { "firstName", firstName },
                { "lastName", lastName },
                { "fullName", $"{firstName} {lastName}".Trim() },
                { "avatarUrl", avatarUrl }
            };

            await ExecuteWriteAsync(query, parameters);
        }

        public async Task DeleteUserAsync(Guid userId)
        {
            const string query = @"
                MATCH (u:User {id: $userId})
                DETACH DELETE u";

            var parameters = new Dictionary<string, object?>
            {
                { "userId", userId.ToString() }
            };

            await ExecuteWriteAsync(query, parameters);
        }

        public async Task SyncFriendshipAsync(Guid user1Id, Guid user2Id)
        {
            const string query = @"
                MERGE (u1:User {id: $user1Id})
                MERGE (u2:User {id: $user2Id})
                MERGE (u1)-[:FRIEND]-(u2)";

            var parameters = new Dictionary<string, object?>
            {
                { "user1Id", user1Id.ToString() },
                { "user2Id", user2Id.ToString() }
            };

            await ExecuteWriteAsync(query, parameters);
        }

        public async Task DeleteFriendshipAsync(Guid user1Id, Guid user2Id)
        {
            const string query = @"
                MATCH (u1:User {id: $user1Id})-[r:FRIEND]-(u2:User {id: $user2Id})
                DELETE r";

            var parameters = new Dictionary<string, object?>
            {
                { "user1Id", user1Id.ToString() },
                { "user2Id", user2Id.ToString() }
            };

            await ExecuteWriteAsync(query, parameters);
        }

        public async Task<List<FriendResponse>> GetFriendRecommendationsAsync(Guid userId, int page = 1, int limit = 10)
        {
            const string query = @"
                MATCH (u:User {id: $userId})
                MATCH (other:User)
                WHERE other.id <> $userId AND NOT (u)-[:FRIEND]-(other)
                OPTIONAL MATCH (u)-[:FRIEND]-(friend)-[:FRIEND]-(other)
                RETURN other.id AS Id, 
                       other.userName AS UserName, 
                       other.fullName AS FullName, 
                       other.avatarUrl AS AvatarUrl, 
                       count(friend) AS MutualFriendsCount
                ORDER BY MutualFriendsCount DESC, other.userName ASC
                SKIP $skip
                LIMIT $limit";

            var parameters = new Dictionary<string, object?>
            {
                { "userId", userId.ToString() },
                { "skip", (page - 1) * limit },
                { "limit", limit }
            };

            return await ExecuteReadAsync(async tx =>
            {
                var result = await tx.RunAsync(query, parameters);
                var recommendations = new List<FriendResponse>();

                while (await result.FetchAsync())
                {
                    var record = result.Current;
                    var idStr = record["Id"].As<string>();
                    var userName = record["UserName"].As<string>();
                    var fullName = record["FullName"].As<string>();
                    var avatarUrl = record["AvatarUrl"].As<string?>();
                    var mutualFriendsCount = Convert.ToInt32(record["MutualFriendsCount"].As<long>());

                    if (Guid.TryParse(idStr, out var id))
                    {
                        recommendations.Add(new FriendResponse(
                            id, 
                            userName, 
                            fullName, 
                            avatarUrl, 
                            mutualFriendsCount));
                    }
                }  

                return recommendations;
            });
        }

        public async Task<List<FriendResponse>> GetMutualFriendsAsync(Guid userId, Guid otherUserId)
        {
            const string query = @"
                MATCH (u1:User {id: $userId})-[:FRIEND]-(mutual:User)-[:FRIEND]-(u2:User {id: $otherUserId})
                RETURN mutual.id AS Id, 
                       mutual.userName AS UserName, 
                       mutual.fullName AS FullName, 
                       mutual.avatarUrl AS AvatarUrl";

            var parameters = new Dictionary<string, object?>
            {
                { "userId", userId.ToString() },
                { "otherUserId", otherUserId.ToString() }
            };

            return await ExecuteReadAsync(async tx =>
            {
                var result = await tx.RunAsync(query, parameters);
                var mutualFriends = new List<FriendResponse>();

                while (await result.FetchAsync())
                {
                    var record = result.Current;
                    var idStr = record["Id"].As<string>();
                    var userName = record["UserName"].As<string>();
                    var fullName = record["FullName"].As<string>();
                    var avatarUrl = record["AvatarUrl"].As<string?>();

                    if (Guid.TryParse(idStr, out var id))
                    {
                        mutualFriends.Add(new FriendResponse(id, userName, fullName, avatarUrl));
                    }
                }

                return mutualFriends;
            });
        }

        public async Task<int> GetMutualFriendCountAsync(Guid userId, Guid otherUserId, CancellationToken cancellationToken = default)
        {
            const string query = @"
                MATCH (u1:User {id: $userId})-[:FRIEND]-(mutual:User)-[:FRIEND]-(u2:User {id: $otherUserId})
                RETURN count(DISTINCT mutual) AS Count";

            var parameters = new Dictionary<string, object?>
            {
                { "userId", userId.ToString() },
                { "otherUserId", otherUserId.ToString() }
            };

            return await ExecuteReadAsync(async tx =>
            {
                var result = await tx.RunAsync(query, parameters);
                if (await result.FetchAsync())
                {
                    var record = result.Current;
                    var countValue = record["Count"].As<long>();
                    return Convert.ToInt32(countValue);
                }

                return 0;
            });
        }

        public async Task<Dictionary<Guid, int>> GetMutualFriendCountsAsync(Guid userId, IEnumerable<Guid> otherUserIds, CancellationToken cancellationToken = default)
        {
            var idList = otherUserIds.ToList();
            if (idList.Count == 0)
                return new Dictionary<Guid, int>();

            const string query = @"
                MATCH (u1:User {id: $userId})-[:FRIEND]-(mutual:User)-[:FRIEND]-(u2:User)
                WHERE u2.id IN $otherIds
                RETURN u2.id AS OtherId, count(DISTINCT mutual) AS Count";

            var parameters = new Dictionary<string, object?>
            {
                { "userId", userId.ToString() },
                { "otherIds", idList.Select(id => id.ToString()).ToList() }
            };

            return await ExecuteReadAsync(async tx =>
            {
                var result = await tx.RunAsync(query, parameters);
                var dict = new Dictionary<Guid, int>();

                while (await result.FetchAsync())
                {
                    var record = result.Current;
                    var idStr = record["OtherId"].As<string>();
                    var count = Convert.ToInt32(record["Count"].As<long>());

                    if (Guid.TryParse(idStr, out var id))
                    {
                        dict[id] = count;
                    }
                }

                // Ensure all requested IDs are present (defaults to 0 for those with no mutual friends)
                foreach (var id in idList)
                {
                    dict.TryAdd(id, 0);
                }

                return dict;
            });
        }

        private async Task ExecuteWriteAsync(string cypher, object parameters)
        {
            var session = _driver.AsyncSession(o => o.WithDatabase(_database));
            try
            {
                await session.ExecuteWriteAsync(async tx =>
                {
                    await tx.RunAsync(cypher, parameters);
                });
            }
            finally
            {
                await session.DisposeAsync();
            }
        }

        private async Task<T> ExecuteReadAsync<T>(Func<IAsyncQueryRunner, Task<T>> work)
        {
            var session = _driver.AsyncSession(o => o.WithDatabase(_database));
            try
            {
                return await session.ExecuteReadAsync(async tx =>
                {
                    return await work(tx);
                });
            }
            finally
            {
                await session.DisposeAsync();
            }
        }
    }
}
