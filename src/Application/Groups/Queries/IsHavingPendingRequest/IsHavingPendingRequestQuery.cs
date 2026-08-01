using Application.Abstractions.Messaging;

namespace Application.Groups.Queries.IsHavingPendingRequest
{
    public sealed record IsHavingPendingRequestQuery(
        long GroupId,
        Guid RequesterUserId) : IQuery<bool>;
}
