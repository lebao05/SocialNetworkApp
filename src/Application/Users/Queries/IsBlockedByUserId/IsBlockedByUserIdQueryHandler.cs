using Application.Abstractions.Repositories;
using Application.Users.Queries.IsBlockedByUserId;
using Domain.Shared;
using MediatR;

namespace Application.Users.Queries.IsBlockedByUserId;

internal sealed class IsBlockedByUserIdQueryHandler
    : IRequestHandler<IsBlockedByUserIdQuery, Result<bool>>
{
    private readonly IConversationRepository _conversationRepository;

    public IsBlockedByUserIdQueryHandler(IConversationRepository conversationRepository)
    {
        _conversationRepository = conversationRepository;
    }

    public async Task<Result<bool>> Handle(
        IsBlockedByUserIdQuery request,
        CancellationToken cancellationToken)
    {
        var isBlocked = await _conversationRepository.IsBlockedByUserIdAsync(
            request.CurrentUserId,
            request.TargetUserId,
            cancellationToken);

        return Result.Success(isBlocked);
    }
}
