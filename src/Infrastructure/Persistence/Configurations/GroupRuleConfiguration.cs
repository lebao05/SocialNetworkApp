using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class GroupRuleConfiguration : IEntityTypeConfiguration<GroupRule>
    {
        public void Configure(EntityTypeBuilder<GroupRule> builder)
        {
            builder.ToTable("GroupRules");

            builder.HasKey(gr => gr.Id);

            builder.Property(gr => gr.Id)
                .HasColumnName("GroupRuleId");

            builder.Property(gr => gr.Title)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(gr => gr.Description)
                .IsRequired()
                .HasColumnType("TEXT");

            builder.Property(gr => gr.CreatedAt)
                .IsRequired();

            // Relationship: GroupRule (many) -> Group (one)
            builder.HasOne(gr => gr.Group)
                .WithMany(g => g.Rules)
                .HasForeignKey(gr => gr.GroupId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
