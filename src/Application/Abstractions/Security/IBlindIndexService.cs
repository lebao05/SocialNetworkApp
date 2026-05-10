namespace Application.Abstractions.Security;

public interface IBlindIndexService
{
    string GenerateHash(string? input);
    List<string> TokenizeAndHash(string? content);
    string GenerateSearchContent(string? content);
}
