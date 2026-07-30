using Application.Abstractions.Messaging;
using Application.DTOs.Admin;

namespace Application.Admin.Queries.GetPostVolumeSeries;

public sealed record GetPostVolumeSeriesQuery(int Days = 7) : IQuery<IReadOnlyList<DailyCountDto>>;