using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Abstractions.Repositories
{
    public interface ISchoolRepository
    {
        Task<School?> GetByIdAsync(long id, CancellationToken cancellationToken);
        Task<List<School>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);
        void Add(School school);
        void Remove(School school);
    }
}
