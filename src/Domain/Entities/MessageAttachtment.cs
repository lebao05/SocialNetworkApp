using Domain.Common;

namespace Domain.Entities;

public class MessageAttachment : BaseEntity
{
    public long MessageId { get; private set; }

    public string FileUrl { get; private set; } = null!;
    public string FileType { get; private set; } = null!;
    public long FileSize { get; private set; }

    // Navigation property
    public Message Message { get; private set; } = null!;
    private MessageAttachment(long Id):base(Id) { }

    public MessageAttachment(
        long id,
        long messageId,
        string fileUrl,
        string fileType,
        long fileSize)
        : base(id)
    {
        MessageId = messageId;
        FileUrl = fileUrl;
        FileType = fileType;
        FileSize = fileSize;
    }
}