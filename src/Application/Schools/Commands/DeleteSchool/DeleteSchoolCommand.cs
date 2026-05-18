using Application.Abstractions.Messaging;
using System;

namespace Application.Schools.Commands.DeleteSchool
{
    public sealed record DeleteSchoolCommand(long SchoolId, Guid UserId) : ICommand;
}
