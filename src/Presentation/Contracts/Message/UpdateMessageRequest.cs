using Application.Abstractions.Messaging;
using Application.DTOs.Messages;
namespace Presentation.Contracts.Message
{
    public sealed record UpdateMessageRequest(string Content);
}
