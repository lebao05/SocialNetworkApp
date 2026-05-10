namespace Application.DTOs.Messages
{
    public sealed record AttachmentDto(
        string FileUrl,
        string FileType,
        long FileSize
    )
    {
        public static AttachmentDto? FromDomain(Domain.Entities.MessageAttachment? attachment)
        {
            if (attachment is null) return null;

            return new AttachmentDto(
                attachment.FileUrl,
                attachment.FileType,
                attachment.FileSize
            );
        }
    }
}
