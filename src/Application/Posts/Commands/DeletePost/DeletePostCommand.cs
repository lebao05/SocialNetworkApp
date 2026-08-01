using Application.Abstractions.Messaging;

namespace Application.Posts.Commands.DeletePost;

public sealed record DeletePostCommand(
    Guid UserId,
    long PostId
) : ICommand;
