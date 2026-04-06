using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace Infrastructure.Persistence.Configurations
{
    public class ConversationMemberConfiguration : IEntityTypeConfiguration<ConversationMember>
    {
        public void Configure(EntityTypeBuilder<ConversationMember> builder)
        {
            builder.ToTable("ConversationMembers");

            builder.HasKey(cm => cm.Id); // ✅ fixed
            builder.Property(x => x.Role).HasConversion<string>();
            builder.HasOne(cm => cm.User)
                .WithMany(u => u.Conversations)
                .HasForeignKey(cm => cm.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // ✅ Correct mapping (use property, not string field)
            builder.HasMany(cm => cm.MemberMessages)
                .WithOne(mm => mm.ConversationMember)
                .HasForeignKey(mm => mm.ConversationMemberId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Navigation(cm => cm.MemberMessages)
                .HasField("_memberMessages")   // 👈 REQUIRED
                .UsePropertyAccessMode(PropertyAccessMode.Field);
        }
    }
}
