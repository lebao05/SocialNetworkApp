using Application.Abstractions.Messaging;

namespace Application.Groups.Queries.IsMemberOfGroup
{
    public sealed record IsMemberOfGroupQuery(
        long GroupId,
        Guid RequesterUserId) : IQuery<bool>;
}
