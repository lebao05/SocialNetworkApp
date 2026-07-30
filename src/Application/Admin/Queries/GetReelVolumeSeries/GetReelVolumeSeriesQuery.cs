using Application.Abstractions.Messaging;
using Application.DTOs.Admin;

namespace Application.Admin.Queries.GetReelVolumeSeries;

public sealed record GetReelVolumeSeriesQuery(int Days = 7) : IQuery<IReadOnlyList<DailyCountDto>>;