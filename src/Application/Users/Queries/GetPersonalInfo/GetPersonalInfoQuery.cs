using Application.Abstractions.Messaging;
using Application.DTOs.Users;
using System;

namespace Application.Users.Queries.GetPersonalInfo
{
    public sealed record GetPersonalInfoQuery(Guid UserId) : IQuery<PersonalInfoResponse>;
}
