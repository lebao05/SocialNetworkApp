namespace Application.DTOs.Groups
{
    public sealed record GroupRuleResponse(
        long Id,
        long GroupId,
        string Title,
        string Description);
}
