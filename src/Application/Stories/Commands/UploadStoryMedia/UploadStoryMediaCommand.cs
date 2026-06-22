using Application.Abstractions.Messaging;
using System.IO;

namespace Application.Stories.Commands.UploadStoryMedia;

public sealed record UploadStoryMediaCommand(
    Guid UserId,
    Stream FileStream,
    string FileName,
    string ContentType
) : ICommand<string>;
