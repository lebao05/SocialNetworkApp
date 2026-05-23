using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Feeds.Commands.MarkLatestFeedAsSeen
{
    internal sealed class MarkLatestFeedAsSeenCommandHandler : ICommandHandler<MarkLatestFeedAsSeenCommand, int>
    {
        private readonly IFeedRepository _feedRepository;

        public MarkLatestFeedAsSeenCommandHandler(IFeedRepository feedRepository)
        {
            _feedRepository = feedRepository;
        }

        public async Task<Result<int>> Handle(MarkLatestFeedAsSeenCommand request, CancellationToken cancellationToken)
        {
            var markedCount = await _feedRepository.MarkLatestAsSeenAsync(
                request.UserId,
                request.Count,
                cancellationToken);

            return Result.Success(markedCount);
        }
    }
}
