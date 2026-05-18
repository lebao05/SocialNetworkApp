using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Shared;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Schools.Commands.AddSchool
{
    internal sealed class AddSchoolCommandHandler : ICommandHandler<AddSchoolCommand, long>
    {
        private readonly ISchoolRepository _schoolRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public AddSchoolCommandHandler(
            ISchoolRepository schoolRepository,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork)
        {
            _schoolRepository = schoolRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<long>> Handle(AddSchoolCommand request, CancellationToken cancellationToken)
        {
            var userExists = await _userRepository.ExistsAsync(request.UserId, cancellationToken);
            if (!userExists)
            {
                return Result.Failure<long>(new Error(
                    "User.NotFound",
                    $"The user with Id {request.UserId} was not found."));
            }

            try
            {
                var school = new School(
                    id: 0,
                    userId: request.UserId,
                    name: request.Name,
                    type: request.Type,
                    degree: request.Degree,
                    major: request.Major,
                    startYear: request.StartYear,
                    endYear: request.EndYear
                );

                _schoolRepository.Add(school);

                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result.Success(school.Id);
            }
            catch (ArgumentException ex)
            {
                return Result.Failure<long>(new Error("School.Validation", ex.Message));
            }
        }
    }
}
