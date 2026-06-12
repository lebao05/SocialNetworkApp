using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Abstractions.SignalR;
using Application.DTOs.Conversations;
using Domain.Shared;
using Microsoft.EntityFrameworkCore;

namespace Application.Conversations.Commands.AddMemberToConversation;

internal sealed class AddMemberToConversationCommandHandler
    : ICommandHandler<AddMemberToConversationCommand, ConversationMemberDto>
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IChatHubNotifier _hubNotifier;
    private readonly IPresenceTracker _presenceTracker;

    public AddMemberToConversationCommandHandler(
        IConversationRepository conversationRepository,
        IUnitOfWork unitOfWork,
        IChatHubNotifier hubNotifier,
        IPresenceTracker presenceTracker)
    {
        _conversationRepository = conversationRepository;
        _unitOfWork = unitOfWork;
        _hubNotifier = hubNotifier;
        _presenceTracker = presenceTracker;
    }

    public async Task<Result<ConversationMemberDto>> Handle(
        AddMemberToConversationCommand request,
        CancellationToken cancellationToken)
    {
        var conversation = await _conversationRepository
            .GetByIdAsync(request.ConversationId, cancellationToken);

        if (conversation is null)
        {
            return Result.Failure<ConversationMemberDto>(
                new Error("Conversation.NotFound", "Conversation not found"));
        }

        if (conversation.IsOneToOne)
        {
            return Result.Failure<ConversationMemberDto>(
                new Error("Conversation.InvalidOperation", "Cannot add members to a one-to-one conversation."));
        }

        var result = conversation.AddMember(request.UserIdToAdd, Domain.Enums.ConversationRole.Member);

        if (result.IsFailure)
        {
            return Result.Failure<ConversationMemberDto>(result.Error);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Reload the member with User navigation property populated
        var updatedMember = await _conversationRepository
            .GetMemberAsync(request.ConversationId, request.UserIdToAdd, cancellationToken);

        if (updatedMember is null)
        {
            return Result.Failure<ConversationMemberDto>(
                new Error("Conversation.MemberNotFound", "Could not load the newly added member."));
        }

        var memberDto = ConversationMemberDto.FromDomain(updatedMember);

        // Notify all existing members via SignalR
        var existingMemberIds = conversation.Members
            .Select(m => m.UserId)
            .ToList();

        await _hubNotifier.NotifyMemberAddedAsync(
            request.ConversationId,
            memberDto,
            existingMemberIds,
            cancellationToken);

        // Add the new member's connections to the SignalR group
        await _hubNotifier.AddConnectionsToGroupAsync(
            request.ConversationId,
            new List<Guid> { request.UserIdToAdd },
            cancellationToken);

        return Result.Success(memberDto);
    }
}
