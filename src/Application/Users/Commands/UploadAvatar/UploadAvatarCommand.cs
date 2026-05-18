using Application.Abstractions.Messaging;
using System;
using System.IO;

namespace Application.Users.Commands.UploadAvatar
{
    public sealed record UploadAvatarCommand(Guid UserId, Stream FileStream, string FileName) : ICommand<string>;
}
