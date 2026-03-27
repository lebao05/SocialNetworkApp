using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace Infrastructure.Persistence.Configurations
{
    public class BlockChatConfiguration : IEntityTypeConfiguration<BlockChat>
    {
        public void Configure(EntityTypeBuilder<BlockChat> builder)
        {
            builder.ToTable("BlockChats");

            // Composite Key
            builder.HasKey(b => new { b.UserId, b.BlockedUserId });

            // Relationship: User (who blocks)
            builder.HasOne(b => b.User)
                .WithMany(u => u.BlockedUsers)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relationship: Blocked User
            builder.HasOne(b => b.BlockedUser)
                .WithMany() // no reverse navigation yet
                .HasForeignKey(b => b.BlockedUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Optional: index for faster lookup
            builder.HasIndex(b => b.BlockedUserId);
        }
    }
}
