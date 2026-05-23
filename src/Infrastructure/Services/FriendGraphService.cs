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

        public async Task<List<FriendResponse>> GetFriendRecommendationsAsync(Guid userId, int limit = 10)
        {
            const string query = @"
                MATCH (u:User {id: $userId})-[:FRIEND]-(friend)-[:FRIEND]-(foaf:User)
                WHERE foaf.id <> $userId AND NOT (u)-[:FRIEND]-(foaf)
                RETURN foaf.id AS Id, 
                       foaf.userName AS UserName, 
                       foaf.fullName AS FullName, 
                       foaf.avatarUrl AS AvatarUrl, 
                       count(friend) AS MutualFriendsCount
                ORDER BY MutualFriendsCount DESC
                LIMIT $limit";

            var parameters = new Dictionary<string, object?>
            {
                { "userId", userId.ToString() },
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

                    if (Guid.TryParse(idStr, out var id))
                    {
                        recommendations.Add(new FriendResponse(id, userName, fullName, avatarUrl));
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

        public async Task<List<FriendResponse>> GetShortestPathAsync(Guid startUserId, Guid endUserId)
        {
            const string query = @"
                MATCH p = shortestPath((u1:User {id: $startUserId})-[:FRIEND*..5]-(u2:User {id: $endUserId}))
                RETURN [node in nodes(p) | { id: node.id, userName: node.userName, fullName: node.fullName, avatarUrl: node.avatarUrl }] AS pathNodes";

            var parameters = new Dictionary<string, object?>
            {
                { "startUserId", startUserId.ToString() },
                { "endUserId", endUserId.ToString() }
            };

            return await ExecuteReadAsync(async tx =>
            {
                var result = await tx.RunAsync(query, parameters);
                var path = new List<FriendResponse>();

                if (await result.FetchAsync())
                {
                    var record = result.Current;
                    var nodesList = record["pathNodes"].As<List<object>>();

                    foreach (var nodeObj in nodesList)
                    {
                        if (nodeObj is Dictionary<string, object> nodeDict)
                        {
                            var idStr = nodeDict.TryGetValue("id", out var idVal) ? idVal?.ToString() : null;
                            var userName = nodeDict.TryGetValue("userName", out var userVal) ? userVal?.ToString() : string.Empty;
                            var fullName = nodeDict.TryGetValue("fullName", out var fullVal) ? fullVal?.ToString() : string.Empty;
                            var avatarUrl = nodeDict.TryGetValue("avatarUrl", out var avVal) ? avVal?.ToString() : null;

                            if (Guid.TryParse(idStr, out var id))
                            {
                                path.Add(new FriendResponse(id, userName ?? string.Empty, fullName ?? string.Empty, avatarUrl));
                            }
                        }
                    }
                }

                return path;
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
