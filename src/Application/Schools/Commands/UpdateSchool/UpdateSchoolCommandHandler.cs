using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Schools.Commands.UpdateSchool
{
    internal sealed class UpdateSchoolCommandHandler : ICommandHandler<UpdateSchoolCommand>
    {
        private readonly ISchoolRepository _schoolRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateSchoolCommandHandler(
            ISchoolRepository schoolRepository,
            IUnitOfWork unitOfWork)
        {
            _schoolRepository = schoolRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(UpdateSchoolCommand request, CancellationToken cancellationToken)
        {
            var school = await _schoolRepository.GetByIdAsync(request.SchoolId, cancellationToken);

            if (school is null)
            {
                return Result.Failure(new Error(
                    "School.NotFound",
                    $"The school with Id {request.SchoolId} was not found."));
            }

            if (school.UserId != request.UserId)
            {
                return Result.Failure(new Error(
                    "School.Forbidden",
                    "You do not have permission to update this school's information."));
            }

            try
            {
                school.UpdateDetails(
                    request.Name,
                    request.Type,
                    request.Degree,
                    request.Major,
                    request.StartYear,
                    request.EndYear
                );

                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result.Success();
            }
            catch (ArgumentException ex)
            {
                return Result.Failure(new Error("School.Validation", ex.Message));
            }
        }
    }
}
