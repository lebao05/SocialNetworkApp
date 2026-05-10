using Domain.Entities;
namespace Application.DTOs.Messages
{
    public sealed record MemberMessageDto(
        Guid UserId,
        MessageStatus Status,
        string? Emotion,
        bool IsInvoked
    )
    {
        public static MemberMessageDto FromDomain(Domain.Entities.MemberMessage memberMessage)
        {
            return new MemberMessageDto(
                memberMessage.UserId,
                memberMessage.Status,
                memberMessage.Emotion,
                memberMessage.IsInvoked
            );
        }
    }
}
