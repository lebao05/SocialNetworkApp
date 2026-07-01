using Application.Abstractions.Messaging;
using Application.DTOs.Users;

namespace Application.Users.Queries.GetUpcomingBirthdays;

public sealed record GetUpcomingBirthdaysQuery(Guid UserId) : IQuery<List<BirthdayDto>>;
