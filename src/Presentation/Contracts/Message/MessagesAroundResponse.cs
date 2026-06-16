using Application.DTOs.Messages;

namespace Presentation.Contracts.Message;

public sealed record MessagesAroundResponse(
    List<MessageDto> Messages,
    bool HasMoreUp,
    bool HasMoreDown
);
