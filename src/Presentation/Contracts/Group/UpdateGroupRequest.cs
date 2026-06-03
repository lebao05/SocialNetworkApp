namespace Presentation.Contracts.Group
{
    public sealed class UpdateGroupRequest
    {
        public string Name { get; init; } = string.Empty;
        public string? Description { get; init; }
        public bool IsPrivate { get; init; }
        public bool IsPostApprovalRequired { get; init; }
        public bool IsGroupJoinApprovalRequired { get; init; }
        public bool AllowAnonymousPost { get; init; }
    }
}
