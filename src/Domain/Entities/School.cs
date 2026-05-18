using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class School : BaseEntity
    {
        public Guid UserId { get; private set; }
        public string Name { get; private set; } = string.Empty;
        public SchoolType Type { get; private set; }
        public DegreeType Degree { get; private set; }
        public string? Major { get; private set; } // e.g., Computer Science
        public int StartYear { get; private set; }
        public int EndYear { get; private set; }

        // Navigation
        public virtual User User { get; private set; } = null!;

        private School(long id) : base(id) { }

        public School(
            long id,
            Guid userId,
            string name,
            SchoolType type,
            DegreeType degree,
            string? major,
            int startYear,
            int endYear) : base(id)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("School name is required");

            UserId = userId;
            Name = name;
            Type = type;
            Degree = degree;
            Major = major;
            StartYear = startYear;
            EndYear = endYear;
            CreatedAt = DateTime.UtcNow;
        }

        public void UpdateDetails(
            string name,
            SchoolType type,
            DegreeType degree,
            string? major,
            int startYear,
            int endYear)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("School name is required");

            Name = name;
            Type = type;
            Degree = degree;
            Major = major;
            StartYear = startYear;
            EndYear = endYear;
            SetUpdated();
        }
    }
}
