using Domain.Enums;
using System;

namespace Application.DTOs.Schools
{
    public sealed record SchoolResponse(
        long Id,
        Guid UserId,
        string Name,
        SchoolType Type,
        DegreeType? Degree,
        string? Major,
        int StartYear,
        int EndYear
    );
}
