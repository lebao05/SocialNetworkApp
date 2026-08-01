using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;
using IReportRepo = Application.Abstractions.Repositories.IReportRepository;
using IPostRepo = Application.Abstractions.Repositories.IPostRepository;
using IReelRepo = Application.Abstractions.Repositories.IReelRepository;

namespace Application.Report.Commands.CreateReport;

internal sealed class CreateReportCommandHandler : ICommandHandler<CreateReportCommand, long>
{
    private readonly IReportRepo _reportRepository;
    private readonly IPostRepo _postRepository;
    private readonly IReelRepo _reelRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateReportCommandHandler(
        IReportRepo reportRepository,
        IPostRepo postRepository,
        IReelRepo reelRepository,
        IUnitOfWork unitOfWork)
    {
        _reportRepository = reportRepository;
        _postRepository = postRepository;
        _reelRepository = reelRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<long>> Handle(
        CreateReportCommand request,
        CancellationToken cancellationToken)
    {
        var (exists, alreadyReported) = await ValidateTargetAsync(request, cancellationToken);
        if (!exists)
            return Result.Failure<long>(new Error("Report.TargetNotFound", "The reported content was not found."));

        if (alreadyReported)
            return Result.Failure<long>(new Error(
                "Report.AlreadyReported",
                "You have already reported this content."));

        var report = new Domain.Entities.Report(
            id: 0,
            reporterId: request.ReporterId,
            reportType: request.ReportType,
            reason: request.Reason,
            details: request.Details,
            postId: request.PostId,
            reelId: request.ReelId,
            userId: request.UserId,
            groupId: request.GroupId);

        await _reportRepository.AddAsync(report, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(report.Id);
    }

    private async Task<(bool exists, bool alreadyReported)> ValidateTargetAsync(
        CreateReportCommand request,
        CancellationToken ct)
    {
        switch (request.ReportType)
        {
            case ReportType.Post when request.PostId.HasValue:
                var post = await _postRepository.GetByIdAsync(request.PostId.Value, ct);
                if (post is null) return (false, false);
                var reported1 = await _reportRepository.ExistsAsync(
                    request.ReporterId, request.ReportType, request.PostId);
                return (true, reported1);

            case ReportType.Reel when request.ReelId.HasValue:
                var reel = await _reelRepository.GetByIdAsync(request.ReelId.Value, ct);
                if (reel is null) return (false, false);
                var reported2 = await _reportRepository.ExistsAsync(
                    request.ReporterId, request.ReportType, default, request.ReelId);
                return (true, reported2);

            case ReportType.User when request.UserId.HasValue:
                if (request.UserId.Value == request.ReporterId)
                    return (false, false);
                var reported3 = await _reportRepository.ExistsAsync(
                    request.ReporterId, request.ReportType, default, default, request.UserId);
                return (true, reported3);

            case ReportType.Group when request.GroupId.HasValue:
                var reported4 = await _reportRepository.ExistsAsync(
                    request.ReporterId, request.ReportType, default, default, default, request.GroupId);
                return (true, reported4);

            default:
                return (false, false);
        }
    }
}
