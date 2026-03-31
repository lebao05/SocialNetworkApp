using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class FriendRequestConfiguration : IEntityTypeConfiguration<FriendRequest>
    {
        public void Configure(EntityTypeBuilder<FriendRequest> builder)
        {
            builder.ToTable("FriendRequests");

            builder.HasKey(fr => fr.Id);

            builder.Property(fr => fr.Status)
                .IsRequired();

            builder.Property(fr => fr.CreatedAt)
                .IsRequired();

            builder.HasOne(fr => fr.Sender)
                .WithMany()
                .HasForeignKey(fr => fr.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(fr => fr.Receiver)
                .WithMany()
                .HasForeignKey(fr => fr.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            // tránh spam request trùng
            builder.HasIndex(fr => new { fr.SenderId, fr.ReceiverId })
                .IsUnique();
        }
    }
}
