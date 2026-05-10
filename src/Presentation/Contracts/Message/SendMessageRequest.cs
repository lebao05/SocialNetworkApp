
namespace Presentation.Contracts.Message
{
    public record SendMessageRequest(long ConversationId, string Content);

}
