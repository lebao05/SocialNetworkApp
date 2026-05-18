using Application.Abstractions.Messaging;
using Domain.Enums;
using System;

namespace Application.Schools.Commands.AddSchool
{
    public sealed record AddSchoolCommand(
        Guid UserId,
        string Name,
        SchoolType Type,
        DegreeType Degree,
        string? Major,
        int StartYear,
        int EndYear
    ) : ICommand<long>;
}
