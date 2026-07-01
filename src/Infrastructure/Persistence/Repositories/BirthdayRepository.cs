using Application.Abstractions.Repositories;
using Application.DTOs.Users;
using Domain.Entities;
using Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class BirthdayRepository : IBirthdayRepository
{
    private readonly AppDbContext _context;

    public BirthdayRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<BirthdayDto>> GetTodayBirthdaysAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var today = DateTime.UtcNow.Date;
        var todayMonth = today.Month;
        var todayDay = today.Day;

        var todayBirthdays = await GetFriendsWithBirthdayAsync(userId, todayMonth, todayDay, cancellationToken);

        return todayBirthdays.Select(f => MapToBirthdayDto(f, today.Year)).ToList();
    }

    public async Task<List<BirthdayDto>> GetUpcomingBirthdaysAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var today = DateTime.UtcNow.Date;
        var todayMonth = today.Month;
        var todayDay = today.Day;
        var currentYear = today.Year;

        var friends = await _context.Friendships
            .Where(f => f.User1Id == userId || f.User2Id == userId)
            .Select(f => f.User1Id == userId ? f.User2Id : f.User1Id)
            .ToListAsync(cancellationToken);

        if (friends.Count == 0)
            return new List<BirthdayDto>();

        var friendsWithDob = await _context.Users
            .Where(u => friends.Contains(u.Id) && u.DateOfBirth != default)
            .ToListAsync(cancellationToken);

        var birthdayDtos = new List<BirthdayDto>();

        foreach (var friend in friendsWithDob)
        {
            var dob = friend.DateOfBirth;
            int month = dob.Month;
            int day = dob.Day;

            // Already counted in today — skip
            if (month == todayMonth && day == todayDay)
                continue;

            // Determine which occurrence is coming up
            var occurrenceThisYear = new DateTime(currentYear, month, day);
            DateTime occurrence;

            if (occurrenceThisYear >= today)
            {
                occurrence = occurrenceThisYear;
            }
            else
            {
                // Birthday already passed this year — next occurrence is next year
                try
                {
                    occurrence = new DateTime(currentYear + 1, month, day);
                }
                catch
                {
                    // Feb 29 on non-leap year — use Feb 28
                    occurrence = new DateTime(currentYear + 1, 2, 28);
                }
            }

            birthdayDtos.Add(MapToBirthdayDto(friend, occurrence.Year));
        }

        return birthdayDtos
            .OrderBy(b => b.Month)
            .ThenBy(b => b.Day)
            .ToList();
    }

    private async Task<List<User>> GetFriendsWithBirthdayAsync(
        Guid userId,
        int month,
        int day,
        CancellationToken cancellationToken)
    {
        var friends = await _context.Friendships
            .Where(f => f.User1Id == userId || f.User2Id == userId)
            .Select(f => f.User1Id == userId ? f.User2Id : f.User1Id)
            .ToListAsync(cancellationToken);

        if (friends.Count == 0)
            return new List<User>();

        return await _context.Users
            .Where(u => friends.Contains(u.Id) && u.DateOfBirth.Month == month && u.DateOfBirth.Day == day && u.DateOfBirth != default)
            .ToListAsync(cancellationToken);
    }

    private static BirthdayDto MapToBirthdayDto(User user, int referenceYear)
    {
        var ageTurning = referenceYear - user.DateOfBirth.Year;
        return new BirthdayDto(
            UserId: user.Id,
            FullName: $"{user.FirstName} {user.LastName}",
            AvatarUrl: user.AvatarUrl,
            Day: user.DateOfBirth.Day,
            Month: user.DateOfBirth.Month,
            AgeTurning: ageTurning,
            MutualFriendsCount: 0
        );
    }
}
