using Application.Abstractions.Messaging;
using Domain.Shared;
using System.IO;

namespace Application.Groups.Commands.UploadGroupCoverPhoto
{
    public sealed record UploadGroupCoverPhotoCommand(long GroupId, Guid OwnerUserId, Stream FileStream, string FileName) : ICommand<string>;
}
