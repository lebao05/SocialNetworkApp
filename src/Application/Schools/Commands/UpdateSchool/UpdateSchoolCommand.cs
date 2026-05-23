using Application.Abstractions.Messaging;
using Domain.Enums;
using System;

namespace Application.Schools.Commands.UpdateSchool
{
    public sealed record UpdateSchoolCommand(
        long SchoolId,
        Guid UserId,
        string Name,
        SchoolType Type,
        DegreeType? Degree,
        string? Major,
        int StartYear,
        int EndYear
    ) : ICommand;
}
