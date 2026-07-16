namespace Presentation.Contracts.User;

public sealed record GetOnlineStateRequest(List<Guid> UserIds);
