using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class ReportedGroupContentConfiguration : IEntityTypeConfiguration<ReportedGroupContent>
    {
        public void Configure(EntityTypeBuilder<ReportedGroupContent> builder)
        {
            builder.ToTable("ReportedGroupContents");

            builder.HasKey(r => r.Id);

            builder.Property(r => r.Id)
                .HasColumnName("ReportedGroupContentId");

            // The reported post
            builder.Property(r => r.PostId)
                .IsRequired();

            // Reason for the report
            builder.Property(r => r.Reason)
                .IsRequired()
                .HasColumnType("SMALLINT");

            // Optional free-text from reporter
            builder.Property(r => r.AdditionalDetail)
                .HasMaxLength(1000);

            // Moderation status
            builder.Property(r => r.Status)
                .IsRequired()
                .HasColumnType("SMALLINT")
                .HasDefaultValue(GroupReportStatus.Pending);

            // Optional reviewer note
            builder.Property(r => r.ReviewNote)
                .HasMaxLength(1000);

            builder.Property(r => r.ReviewedAt)
                .IsRequired(false);

            builder.Property(r => r.CreatedAt)
                .IsRequired();

            // ── Relationships ────────────────────────────────────────────

            // ReportedGroupContent -> Group
            builder.HasOne(r => r.Group)
                .WithMany()
                .HasForeignKey(r => r.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            // ReportedGroupContent -> Post
            builder.HasOne(r => r.Post)
                .WithMany()
                .HasForeignKey(r => r.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            // ReportedGroupContent -> Reporter (User)
            builder.HasOne(r => r.Reporter)
                .WithMany()
                .HasForeignKey(r => r.ReporterId)
                .OnDelete(DeleteBehavior.Restrict);

            // ReportedGroupContent -> ReviewedBy (User, optional)
            builder.HasOne(r => r.ReviewedBy)
                .WithMany()
                .HasForeignKey(r => r.ReviewedByUserId)
                .OnDelete(DeleteBehavior.SetNull)
                .IsRequired(false);

            // Prevent duplicate reports: one user can report the same post once
            builder.HasIndex(r => new { r.ReporterId, r.PostId })
                .IsUnique();

            // Efficient moderation queue lookup
            builder.HasIndex(r => new { r.GroupId, r.Status });
        }
    }
}
