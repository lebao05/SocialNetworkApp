namespace Application.DTOs.Messages
{
    public sealed record AttachmentDto(
        long Id,
        long MessageId,
        string FileUrl,
        string FileType,
        long FileSize)
    {
        public static AttachmentDto? FromDomain(Domain.Entities.MessageAttachment? attachment)
        {
            if (attachment is null) return null;

            return new AttachmentDto(
                Id: attachment.Id,
                MessageId: attachment.MessageId,
                FileUrl: attachment.FileUrl,
                FileType: attachment.FileType,
                FileSize: attachment.FileSize
            );
        }
    }
}
