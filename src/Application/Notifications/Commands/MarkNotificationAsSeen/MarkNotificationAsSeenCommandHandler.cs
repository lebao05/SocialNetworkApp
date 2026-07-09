using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Notifications.Commands.MarkNotificationAsSeen;

internal sealed class MarkNotificationAsSeenCommandHandler
    : ICommandHandler<MarkNotificationAsSeenCommand, MarkNotificationAsSeenResponse>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IUnitOfWork _unitOfWork;

    public MarkNotificationAsSeenCommandHandler(
        INotificationRepository notificationRepository,
        IUnitOfWork unitOfWork)
    {
        _notificationRepository = notificationRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<MarkNotificationAsSeenResponse>> Handle(
        MarkNotificationAsSeenCommand request,
        CancellationToken cancellationToken)
    {
        await _notificationRepository.MarkAsSeenAsync(
            request.NotificationId,
            request.UserId,
            cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(new MarkNotificationAsSeenResponse());
    }
}
