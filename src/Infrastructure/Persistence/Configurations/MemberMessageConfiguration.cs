using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace Infrastructure.Persistence.Configurations
{
    public class MemberMessageConfiguration : IEntityTypeConfiguration<MemberMessage>
    {
        public void Configure(EntityTypeBuilder<MemberMessage> builder)
        {
            builder.ToTable("MemberMessages");

            builder.HasKey(mm => new { mm.Id });

        }
    }

}
