namespace Domain.Common;

public abstract class BaseEntity : IEquatable<BaseEntity>
{
    public long Id { get; init; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    protected BaseEntity(long id)
    {
        Id = id;
        CreatedAt = DateTime.UtcNow;
    }

    public void SetUpdated()
        => UpdatedAt = DateTime.UtcNow;

    public bool Equals(BaseEntity? other)
    {
        if (other is null) return false;
        if (ReferenceEquals(this, other)) return true;
        return Id.Equals(other.Id);
    }

    public override bool Equals(object? obj)
        => Equals(obj as BaseEntity);

    public override int GetHashCode()
        => Id.GetHashCode();
}