using Domain.Enums;

namespace Presentation.Contracts.School
{
    public sealed record AddSchoolRequest(
        string Name,
        SchoolType Type,
        DegreeType Degree,
        string? Major,
        int StartYear,
        int EndYear
    );
}
