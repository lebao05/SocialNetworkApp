using Application.Abstractions.Repositories;
using Domain.Entities;
using Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class SchoolRepository : ISchoolRepository
    {
        private readonly AppDbContext _context;

        public SchoolRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<School?> GetByIdAsync(long id, CancellationToken cancellationToken)
        {
            return await _context.Schools
                .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        }

        public async Task<List<School>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken)
        {
            return await _context.Schools
                .Where(s => s.UserId == userId)
                .OrderBy(s => s.StartYear)
                .ToListAsync(cancellationToken);
        }

        public void Add(School school)
        {
            _context.Schools.Add(school);
        }

        public void Remove(School school)
        {
            _context.Schools.Remove(school);
        }
    }
}
