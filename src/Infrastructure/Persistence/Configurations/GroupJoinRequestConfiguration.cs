using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class GroupJoinRequestConfiguration : IEntityTypeConfiguration<GroupJoinRequest>
    {
        public void Configure(EntityTypeBuilder<GroupJoinRequest> builder)
        {
            builder.ToTable("GroupRequests"); // keep existing table name for migration compatibility

            // Primary Key
            builder.HasKey(gr => gr.Id);

            builder.Property(gr => gr.Id)
                .HasColumnName("GroupRequestId");

            // Request Status configuration
            builder.Property(gr => gr.Status)
                .IsRequired()
                .HasColumnType("SMALLINT");

            // Relationship: GroupJoinRequest -> User
            builder.HasOne(gr => gr.User)
                .WithMany()
                .HasForeignKey(gr => gr.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Performance composite index
            builder.HasIndex(gr => new { gr.GroupId, gr.UserId, gr.Status });
        }
    }
}
