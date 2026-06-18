using Application.Abstractions.Repositories;
using Application.Users.Queries.IsBlockingUser;
using Domain.Shared;
using MediatR;

namespace Application.Users.Queries.IsBlockingUser;

internal sealed class IsBlockingUserQueryHandler
    : IRequestHandler<IsBlockingUserQuery, Result<bool>>
{
    private readonly IConversationRepository _conversationRepository;

    public IsBlockingUserQueryHandler(IConversationRepository conversationRepository)
    {
        _conversationRepository = conversationRepository;
    }

    public async Task<Result<bool>> Handle(
        IsBlockingUserQuery request,
        CancellationToken cancellationToken)
    {
        var isBlocking = await _conversationRepository.IsBlockingUserAsync(
            request.CurrentUserId,
            request.TargetUserId,
            cancellationToken);

        return Result.Success(isBlocking);
    }
}
