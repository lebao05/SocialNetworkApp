using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class SchoolConfiguration : IEntityTypeConfiguration<School>
    {
        public void Configure(EntityTypeBuilder<School> builder)
        {
            builder.ToTable("Schools");

            // Primary Key: Inherited Id from BaseEntity mapped to "SchoolId" in database
            builder.HasKey(s => s.Id);

            builder.Property(s => s.Id)
                .HasColumnName("SchoolId");

            // Name
            builder.Property(s => s.Name)
                .IsRequired()
                .HasMaxLength(250);

            // Type (SMALLINT representing SchoolType enum)
            builder.Property(s => s.Type)
                .IsRequired()
                .HasColumnType("SMALLINT");

            // Degree (SMALLINT representing DegreeType enum)
            builder.Property(s => s.Degree)
                .HasColumnType("SMALLINT");

            // Major
            builder.Property(s => s.Major)
                .IsRequired(false)
                .HasMaxLength(100);

            // StartYear
            builder.Property(s => s.StartYear)
                .IsRequired();

            // EndYear
            builder.Property(s => s.EndYear)
                .IsRequired();

            // Index on UserId for quick lookups of a user's education history
            builder.HasIndex(s => s.UserId);
        }
    }
}
