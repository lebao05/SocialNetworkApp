using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Abstractions.Security;
using Domain.Entities;
using Domain.Shared;

namespace Application.Messages.Commands.ForwardMessage;

internal sealed class ForwardMessageCommandHandler
    : ICommandHandler<ForwardMessageCommand, List<long>>
{
    private readonly IMessageRepository _messageRepository;
    private readonly IConversationRepository _conversationRepository;
    private readonly IBlindIndexService _blindIndexService;
    private readonly IUnitOfWork _unitOfWork;

    public ForwardMessageCommandHandler(
        IMessageRepository messageRepository,
        IConversationRepository conversationRepository,
        IBlindIndexService blindIndexService,
        IUnitOfWork unitOfWork)
    {
        _messageRepository = messageRepository;
        _conversationRepository = conversationRepository;
        _blindIndexService = blindIndexService;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<List<long>>> Handle(
        ForwardMessageCommand request,
        CancellationToken cancellationToken)
    {
        // 1. Get original message
        var originalMessage = await _messageRepository.GetByIdAsync(request.MessageId, cancellationToken);
        if (originalMessage is null)
        {
            return Result.Failure<List<long>>(new Error("Message.NotFound", "Source message not found"));
        }

        // 2. Prepare search content
        var searchContent = _blindIndexService.GenerateSearchContent(originalMessage.Content);

        // 3. Process targets
        foreach (var conversationId in request.TargetConversationIds)
        {
            var conversation = await _conversationRepository.GetByIdAsync(conversationId, cancellationToken);
            if (conversation is null) continue;

            if (conversation.Members.All(m => m.UserId != request.UserId)) continue;

            var newMessage = new Message(
                0,
                conversationId,
                request.UserId,
                originalMessage.Content
            );

            newMessage.UpdateSearchContent(searchContent);
            newMessage.SetForwardedFrom(originalMessage.Id); // Track origin
            
            _messageRepository.Add(newMessage);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(new List<long>());
    }
}
