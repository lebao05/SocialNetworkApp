namespace Presentation.Contracts.Group
{
    public sealed class CreateGroupRequest
    {
        public string Name { get; init; } = string.Empty;
        public bool IsPrivate { get; init; }
    }
}
