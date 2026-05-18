using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class GroupMemberConfiguration : IEntityTypeConfiguration<GroupMember>
    {
        public void Configure(EntityTypeBuilder<GroupMember> builder)
        {
            builder.ToTable("GroupMembers");

            // Primary Key: Inherited Id from BaseEntity mapped to "GroupMemberId" in database
            builder.HasKey(gm => gm.Id);
            
            builder.Property(gm => gm.Id)
                .HasColumnName("GroupMemberId");

            // Member Role configuration
            builder.Property(gm => gm.Role)
                .IsRequired()
                .HasColumnType("SMALLINT");

            // Unique index to prevent duplicate user memberships within a single group
            builder.HasIndex(gm => new { gm.GroupId, gm.UserId })
                .IsUnique();
        }
    }
}
