using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
    {
        public void Configure(EntityTypeBuilder<Notification> builder)
        {
            builder.ToTable("Notifications");

            // Primary Key: Inherited Id from BaseEntity mapped to "NotificationId" in database
            builder.HasKey(n => n.Id);
            
            builder.Property(n => n.Id)
                .HasColumnName("NotificationId");

            // NotificationType configuration (SMALLINT)
            builder.Property(n => n.NotificationType)
                .IsRequired()
                .HasColumnType("SMALLINT");

            // EntityType configuration (SMALLINT)
            builder.Property(n => n.EntityType)
                .IsRequired()
                .HasColumnType("SMALLINT");

            // MessageTemplate configuration (VARCHAR(255))
            builder.Property(n => n.MessageTemplate)
                .IsRequired()
                .HasMaxLength(255);

            // Metadata configuration (JSONB)
            builder.Property(n => n.Metadata)
                .HasColumnType("jsonb")
                .IsRequired(false);

            // IsSeen configuration (BOOLEAN)
            builder.Property(n => n.IsSeen)
                .IsRequired();

            // Relationship: Notification -> ActorUser (User triggering action)
            builder.HasOne(n => n.ActorUser)
                .WithMany()
                .HasForeignKey(n => n.ActorUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Composite indexes for inbox performance
            builder.HasIndex(n => new { n.RecipientUserId, n.IsSeen, n.CreatedAt });
            builder.HasIndex(n => new { n.RecipientUserId, n.CreatedAt });
        }
    }
}
