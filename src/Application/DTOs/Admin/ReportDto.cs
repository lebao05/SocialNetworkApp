using Domain.Enums;

namespace Application.DTOs.Admin;

/// <summary>
/// A unified report DTO for the admin moderation page.
/// The <c>Content</c> property is a discriminated union: exactly one of its
/// four members is non-null, matching <c>ReportType</c>.
///
/// Usage in Razor:
/// <code>@@if (Model.Content.Post is not null) { ... }</code>
/// </summary>
public sealed record ReportDto(
    long Id,
    ReportType ReportType,
    ReporterSummaryDto Reporter,

    // ── Discriminated union: only one of these is populated ──────
    ReportedPostContentDto?   Post,
    ReportedReelContentDto?   Reel,
    ReportedUserContentDto?  User,
    ReportedGroupContentDto? Group,

    // ── Report details ──────────────────────────────────────────
    ReportReason Reason,
    string? Details,
    int ReportCount,     // how many distinct users reported this same content

    // ── Review state ───────────────────────────────────────────
    ReportStatus Status,
    ReporterSummaryDto? ReviewedBy,
    DateTime? ReviewedAt,
    string? ReviewNote,

    // ── Timestamps ────────────────────────────────────────────
    DateTime CreatedAt
);
