using Application.Abstractions;
using Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore.Storage;

namespace Infrastructure.Persistence.Repositories
{
    public sealed class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        private IDbContextTransaction? _transaction;

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
        {
            if (_transaction is not null)
            {
                return;
            }
            _transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
        }

        public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
        {
            if (_transaction is null)
            {
                return;
            }

            await _transaction.CommitAsync(cancellationToken);
            await _transaction.DisposeAsync();
            _transaction = null;
        }

        public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
        {
            if (_transaction is null)
            {
                return;
            }

            await _transaction.RollbackAsync(cancellationToken);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }
}
