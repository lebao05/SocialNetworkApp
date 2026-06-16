namespace Application.DTOs.Messages;

public sealed record MessagesAroundDto(
    List<MessageDto> Messages,
    bool HasMoreUp,
    bool HasMoreDown
);
