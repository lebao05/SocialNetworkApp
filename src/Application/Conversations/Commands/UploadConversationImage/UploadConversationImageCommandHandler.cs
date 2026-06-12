using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Conversations.Commands.UploadConversationImage;

internal sealed class UploadConversationImageCommandHandler
    : ICommandHandler<UploadConversationImageCommand, string>
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IUploadService _uploadService;
    private readonly IUnitOfWork _unitOfWork;

    public UploadConversationImageCommandHandler(
        IConversationRepository conversationRepository,
        IUploadService uploadService,
        IUnitOfWork unitOfWork)
    {
        _conversationRepository = conversationRepository;
        _uploadService = uploadService;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<string>> Handle(
        UploadConversationImageCommand request,
        CancellationToken cancellationToken)
    {
        var conversation = await _conversationRepository.GetByIdAsync(
            request.ConversationId, cancellationToken);

        if (conversation is null)
        {
            return Result.Failure<string>(new Error(
                "Conversation.NotFound",
                $"The conversation with Id {request.ConversationId} was not found."));
        }

        var member = conversation.Members.FirstOrDefault(m => m.UserId == request.RequesterId);
        if (member is null)
        {
            return Result.Failure<string>(new Error(
                "Conversation.NotMember",
                "You are not a member of this conversation."));
        }

        try
        {
            var imageUrl = await _uploadService.UploadImageAsync(
                request.FileStream, request.FileName);

            conversation.SetImageUrl(imageUrl);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(imageUrl);
        }
        catch (Exception ex)
        {
            return Result.Failure<string>(new Error(
                "ConversationImage.UploadFailed",
                ex.Message));
        }
    }
}
