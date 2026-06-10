

namespace Application.DTOs.Messages
{
    public sealed record MessageDto(
        long Id,
        Guid SenderId,
        string SenderName,
        string? Content,
        string MessageType,
        DateTime CreatedAt,
        AttachmentDto? Attachment,
        List<MemberMessageDto> MemberStates,
        long? ForwardFromMessageId
    )
    {
        public static MessageDto FromDomain(Domain.Entities.Message message)
        {
            return new MessageDto(
                Id: message.Id,
                SenderId: message.CreatorId,
                SenderName: $"{message.Creator.FirstName} {message.Creator.LastName}",
                Content: message.Content,
                MessageType: message.MessageType.ToString(),
                CreatedAt: message.CreatedAt,

                Attachment: AttachmentDto.FromDomain(message.Attachment),

                MemberStates: message.MemberMessages
                    .Select(MemberMessageDto.FromDomain)
                    .ToList(),

                ForwardFromMessageId: message.ForwardFromMessageId
            );
        }
    }
}
