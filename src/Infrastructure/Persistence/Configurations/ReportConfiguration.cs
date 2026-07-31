using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class ReportConfiguration : IEntityTypeConfiguration<Report>
{
    public void Configure(EntityTypeBuilder<Report> builder)
    {
        builder.ToTable("Reports");

        builder.HasKey(r => r.Id);

        // ── Report type ────────────────────────────────────────
        builder.Property(r => r.ReportType)
            .IsRequired()
            .HasColumnType("SMALLINT");

        // ── Reason ─────────────────────────────────────────────
        builder.Property(r => r.Reason)
            .IsRequired()
            .HasColumnType("SMALLINT");

        // ── Optional free-text detail ──────────────────────────
        builder.Property(r => r.Details)
            .HasMaxLength(1000);

        // ── Status ────────────────────────────────────────────
        builder.Property(r => r.Status)
            .IsRequired()
            .HasColumnType("SMALLINT")
            .HasDefaultValue(ReportStatus.Pending);

        // ── Review ────────────────────────────────────────────
        builder.Property(r => r.ReviewNote)
            .HasMaxLength(1000);

        // ── Navigations ────────────────────────────────────────

        // Reporter
        builder.HasOne(r => r.Reporter)
            .WithMany()
            .HasForeignKey(r => r.ReporterId)
            .OnDelete(DeleteBehavior.Restrict);

        // Reported Post (optional)
        builder.HasOne(r => r.Post)
            .WithMany()
            .HasForeignKey(r => r.PostId)
            .OnDelete(DeleteBehavior.Restrict);

        // Reported Reel (optional)
        builder.HasOne(r => r.Reel)
            .WithMany()
            .HasForeignKey(r => r.ReelId)
            .OnDelete(DeleteBehavior.Restrict);

        // Reported User (optional)
        builder.HasOne(r => r.ReportedUser)
            .WithMany()
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Reported Group (optional)
        builder.HasOne(r => r.Group)
            .WithMany()
            .HasForeignKey(r => r.GroupId)
            .OnDelete(DeleteBehavior.Restrict);

        // Reviewer (optional)
        builder.HasOne(r => r.ReviewedBy)
            .WithMany()
            .HasForeignKey(r => r.ReviewedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // ── Indexes ───────────────────────────────────────────
        builder.HasIndex(r => r.Status);
        builder.HasIndex(r => r.ReportType);
        builder.HasIndex(r => r.ReporterId);
        builder.HasIndex(r => r.CreatedAt);
    }
}
