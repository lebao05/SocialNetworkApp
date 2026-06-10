using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using Application.Abstractions.Security;

namespace Infrastructure.Services;

public class BlindIndexService : IBlindIndexService
{
    private const string SearchableSalt = "SearchableIndexSalt_v1";

    public string GenerateHash(string? input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return string.Empty;

        using var sha256 = SHA256.Create();
        var combined = $"{SearchableSalt}{input.ToLowerInvariant()}";
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(combined));
        return Convert.ToBase64String(bytes);
    }

    public List<string> TokenizeAndHash(string? content)
    {
        if (string.IsNullOrWhiteSpace(content))
            return new List<string>();

        var tokens = Regex.Split(content.ToLowerInvariant(), @"\W+")
            .Where(t => t.Length >= 2)
            .Distinct()
            .ToList();

        return tokens;
    }

    public string GenerateSearchContent(string? content)
    {
        if (string.IsNullOrWhiteSpace(content))
            return string.Empty;

        var tokens = TokenizeAndHash(content);
        return string.Join(" ", tokens);
    }
}
