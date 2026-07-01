using Application.Abstractions.Messaging;

namespace Application.Reels.Commands.RecordReelView;

public sealed record RecordReelViewCommand(
    long ReelId,
    Guid UserId
) : ICommand;
