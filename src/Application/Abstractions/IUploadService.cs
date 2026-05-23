namespace Application.Abstractions
{
    public interface IUploadService
    {
        Task<string> UploadImageAsync(Stream fileStream, string fileName);
        Task<string> UploadVideoAsync(Stream fileStream, string fileName);
        Task<string> UploadFileAsync(Stream fileStream, string fileName);
    }
}
