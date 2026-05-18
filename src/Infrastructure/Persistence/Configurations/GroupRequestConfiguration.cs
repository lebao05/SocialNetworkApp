using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class GroupRequestConfiguration : IEntityTypeConfiguration<GroupRequest>
    {
        public void Configure(EntityTypeBuilder<GroupRequest> builder)
        {
            builder.ToTable("GroupRequests");

            // Primary Key: Inherited Id from BaseEntity mapped to "GroupRequestId" in database
            builder.HasKey(gr => gr.Id);
            
            builder.Property(gr => gr.Id)
                .HasColumnName("GroupRequestId");

            // Request Status configuration
            builder.Property(gr => gr.Status)
                .IsRequired()
                .HasColumnType("SMALLINT");

            // Relationship: GroupRequest -> User
            builder.HasOne(gr => gr.User)
                .WithMany()
                .HasForeignKey(gr => gr.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Performance composite index
            builder.HasIndex(gr => new { gr.GroupId, gr.UserId, gr.Status });
        }
    }
}
