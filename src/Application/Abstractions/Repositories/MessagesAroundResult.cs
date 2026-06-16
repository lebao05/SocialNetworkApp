using Domain.Entities;

namespace Application.Abstractions.Repositories;

public sealed record MessagesAroundResult(
    List<Message> Messages,
    bool HasMoreUp,
    bool HasMoreDown
);
