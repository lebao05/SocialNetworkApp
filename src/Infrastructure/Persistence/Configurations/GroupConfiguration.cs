using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class GroupConfiguration : IEntityTypeConfiguration<Group>
    {
        public void Configure(EntityTypeBuilder<Group> builder)
        {
            builder.ToTable("Groups");

            // Primary Key: Inherited Id from BaseEntity mapped to "GroupId" in database
            builder.HasKey(g => g.Id);
            
            builder.Property(g => g.Id)
                .HasColumnName("GroupId");

            // Group Name column config
            builder.Property(g => g.Name)
                .IsRequired()
                .HasMaxLength(255);

            // Group Info description config
            builder.Property(g => g.Description)
                .HasColumnType("TEXT");

            // Privacy type configuration
            builder.Property(g => g.PrivacyType)
                .IsRequired()
                .HasColumnType("SMALLINT");

            // Cover photo config
            builder.Property(g => g.CoverPhotoUrl)
                .HasColumnType("TEXT");

            // ── Settings columns ─────────────────────────────────────────
            builder.Property(g => g.IsHidden)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(g => g.IsPostApprovalRequired)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(g => g.IsGroupJoinApprovalRequired)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(g => g.AllowAnonymousPost)
                .IsRequired()
                .HasDefaultValue(false);

            // ===================================
            // Navigation Backing Fields & relationships
            // ===================================

            // Group -> Members
            builder.HasMany(g => g.Members)
                .WithOne(gm => gm.Group)
                .HasForeignKey(gm => gm.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Navigation(g => g.Members)
                .HasField("_members")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            // Group -> JoinRequests
            builder.HasMany(g => g.Requests)
                .WithOne(gr => gr.Group)
                .HasForeignKey(gr => gr.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Navigation(g => g.Requests)
                .HasField("_requests")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            // Group -> Rules
            builder.HasMany(g => g.Rules)
                .WithOne(gr => gr.Group)
                .HasForeignKey(gr => gr.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Navigation(g => g.Rules)
                .HasField("_rules")
                .UsePropertyAccessMode(PropertyAccessMode.Field);
        }
    }
}
