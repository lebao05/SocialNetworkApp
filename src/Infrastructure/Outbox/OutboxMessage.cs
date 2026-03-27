namespace Infrastructure.Outbox
{
    public sealed class OutboxMessage
    {
        public Guid Id { get; set; }

        public string Type { get; set; } = string.Empty;

        public string PayLoad { get; set; } = string.Empty;

        public DateTime OccurredOnUtc { get; set; } = DateTime.UtcNow;

        public DateTime? ProcessedOnUtc { get; set; }

        public string? Error { get; set; }
    }
}
