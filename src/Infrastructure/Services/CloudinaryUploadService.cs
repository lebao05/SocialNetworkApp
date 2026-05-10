using Application.Abstractions;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
namespace Infrastructure.Services
{
    public class CloudinaryUploadService : IUploadService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryUploadService(string cloudName, string apiKey, string apiSecret)
        {
            var account = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(account);
        }

        public async Task<string> UploadImageAsync(Stream fileStream, string fileName)
        {
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(fileName, fileStream),
                UseFilename = true,
                UniqueFilename = false,
                Overwrite = true
            };

            var result = await _cloudinary.UploadAsync(uploadParams);

            if (result.StatusCode != System.Net.HttpStatusCode.OK)
            {
                throw new Exception("Upload failed: " + result.Error?.Message);
            }

            return result.SecureUrl.ToString();
        }
    }
}
