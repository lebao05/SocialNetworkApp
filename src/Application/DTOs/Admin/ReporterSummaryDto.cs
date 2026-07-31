using Domain.Enums;

namespace Application.DTOs.Admin;

/// <summary>
/// Minimal author summary used inside reported content objects so the admin
/// can see who owns the flagged item without a full user profile fetch.
/// </summary>
public record ReporterSummaryDto(
    Guid Id,
    string Name,
    string? AvatarUrl
);
