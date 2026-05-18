using Application.Abstractions.Messaging;
using Application.DTOs.Schools;
using System;
using System.Collections.Generic;

namespace Application.Schools.Queries.GetSchools
{
    public sealed record GetSchoolsQuery(Guid UserId) : IQuery<List<SchoolResponse>>;
}
