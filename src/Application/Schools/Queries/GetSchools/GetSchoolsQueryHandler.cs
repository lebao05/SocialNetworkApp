using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Schools;
using Domain.Shared;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Schools.Queries.GetSchools
{
    internal sealed class GetSchoolsQueryHandler : IQueryHandler<GetSchoolsQuery, List<SchoolResponse>>
    {
        private readonly ISchoolRepository _schoolRepository;

        public GetSchoolsQueryHandler(ISchoolRepository schoolRepository)
        {
            _schoolRepository = schoolRepository;
        }

        public async Task<Result<List<SchoolResponse>>> Handle(GetSchoolsQuery request, CancellationToken cancellationToken)
        {
            var schools = await _schoolRepository.GetByUserIdAsync(request.UserId, cancellationToken);

            var response = schools.Select(s => new SchoolResponse(
                s.Id,
                s.UserId,
                s.Name,
                s.Type,
                s.Degree,
                s.Major,
                s.StartYear,
                s.EndYear
            )).ToList();

            return Result.Success(response);
        }
    }
}
