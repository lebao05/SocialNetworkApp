using Application.Abstractions.Messaging;
using System;
using System.IO;

namespace Application.Users.Commands.UploadCoverPhoto
{
    public sealed record UploadCoverPhotoCommand(Guid UserId, Stream FileStream, string FileName) : ICommand<string>;
}
