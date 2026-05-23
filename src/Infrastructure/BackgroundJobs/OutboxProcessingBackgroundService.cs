using Infrastructure.Outbox;
using Infrastructure.Persistence.Contexts;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Quartz;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.BackgroundJobs
{
    [DisallowConcurrentExecution]
    public class OutboxProcessingBackgroundService : IJob
    {
        private readonly AppDbContext _dbContext;
        private readonly IPublisher _publisher;

        public OutboxProcessingBackgroundService(AppDbContext dbContext, IPublisher publisher)
        {
            _dbContext = dbContext;
            _publisher = publisher;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            var messages = await _dbContext.OutboxMessages
                .Where(m => m.ProcessedOnUtc == null)
                .OrderBy(m => m.OccurredOnUtc)
                .Take(20)
                .ToListAsync(context.CancellationToken);

            if (!messages.Any())
            {
                return;
            }

            foreach (var message in messages)
            {
                try
                {
                    var type = Type.GetType(message.Type);
                    if (type == null)
                    {
                        message.Error = $"Type '{message.Type}' could not be loaded.";
                        message.ProcessedOnUtc = DateTime.UtcNow;
                        continue;
                    }

                    var domainEvent = JsonConvert.DeserializeObject(message.PayLoad, type);
                    if (domainEvent == null)
                    {
                        message.Error = "Payload deserialization resulted in null.";
                        message.ProcessedOnUtc = DateTime.UtcNow;
                        continue;
                    }

                    await _publisher.Publish(domainEvent, context.CancellationToken);

                    message.ProcessedOnUtc = DateTime.UtcNow;
                }
                catch (Exception ex)
                {
                    message.Error = ex.ToString();
                    message.ProcessedOnUtc = DateTime.UtcNow;
                }
            }

            await _dbContext.SaveChangesAsync(context.CancellationToken);
        }
    }
}
