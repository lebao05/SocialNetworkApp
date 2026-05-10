namespace Application.Abstractions
{
    public interface IUploadService
    {
        Task<string> UploadImageAsync(Stream fileStream, string fileName);
    }
}
