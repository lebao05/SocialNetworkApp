using Application.Abstractions.Security;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace Infrastructure.Security;

public class BlindIndexService : IBlindIndexService
{
    private readonly byte[] _key;

    public BlindIndexService(IConfiguration configuration)
    {
        var secret = configuration["Security:BlindIndexKey"] ?? "default_secret_key_change_me_in_production";
        _key = Encoding.UTF8.GetBytes(secret);
    }

    public string GenerateHash(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;

        using var hmac = new HMACSHA256(_key);
        var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(input.ToLowerInvariant().Trim()));
        return Convert.ToHexString(hashBytes);
    }

    public List<string> TokenizeAndHash(string? content)
    {
        if (string.IsNullOrWhiteSpace(content)) return new List<string>();

        // Split by non-alphanumeric characters and filter small words if desired
        var words = Regex.Split(content.ToLowerInvariant(), @"\W+")
                         .Where(w => w.Length > 1) 
                         .Distinct();

        return words.Select(GenerateHash).ToList();
    }

    public string GenerateSearchContent(string? content)
    {
        var hashes = TokenizeAndHash(content);
        return string.Join(" ", hashes);
    }
}
