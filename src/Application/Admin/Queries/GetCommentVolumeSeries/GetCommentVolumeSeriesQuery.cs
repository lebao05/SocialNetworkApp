using Application.Abstractions.Messaging;
using Application.DTOs.Admin;

namespace Application.Admin.Queries.GetCommentVolumeSeries;

public sealed record GetCommentVolumeSeriesQuery(int Days = 7) : IQuery<IReadOnlyList<DailyCountDto>>;