using Application.Abstractions.Messaging;
using Application.DTOs.Users;

namespace Application.Users.Queries.GetTodayBirthdays;

public sealed record GetTodayBirthdaysQuery(Guid UserId) : IQuery<List<BirthdayDto>>;
