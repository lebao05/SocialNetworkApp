using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Schools.Commands.DeleteSchool
{
    internal sealed class DeleteSchoolCommandHandler : ICommandHandler<DeleteSchoolCommand>
    {
        private readonly ISchoolRepository _schoolRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteSchoolCommandHandler(
            ISchoolRepository schoolRepository,
            IUnitOfWork unitOfWork)
        {
            _schoolRepository = schoolRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(DeleteSchoolCommand request, CancellationToken cancellationToken)
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
                    "You do not have permission to delete this school's information."));
            }

            _schoolRepository.Remove(school);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
