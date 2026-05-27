using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
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

        public async Task<string> UploadVideoAsync(Stream fileStream, string fileName)
        {
            var uploadParams = new VideoUploadParams
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

        public async Task<string> UploadFileAsync(Stream fileStream, string fileName)
        {
            var uploadParams = new RawUploadParams
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

        public async Task DeleteFileAsync(string fileUrl)
        {
            if (string.IsNullOrWhiteSpace(fileUrl)) return;

            try
            {
                var uri = new Uri(fileUrl);
                var segments = uri.Segments;

                int uploadIndex = -1;
                for (int i = 0; i < segments.Length; i++)
                {
                    if (segments[i].Trim('/').Equals("upload", StringComparison.OrdinalIgnoreCase))
                    {
                        uploadIndex = i;
                        break;
                    }
                }

                if (uploadIndex == -1 || uploadIndex < 2) return;

                string resourceType = segments[uploadIndex - 1].Trim('/');

                int versionIndex = uploadIndex + 1;
                if (versionIndex < segments.Length && segments[versionIndex].StartsWith("v", StringComparison.OrdinalIgnoreCase))
                {
                    versionIndex++;
                }

                var remainingSegments = segments.Skip(versionIndex).Select(s => s.Trim('/')).ToList();
                if (!remainingSegments.Any()) return;

                string publicId = string.Join("/", remainingSegments);

                if (resourceType.Equals("image", StringComparison.OrdinalIgnoreCase) ||
                    resourceType.Equals("video", StringComparison.OrdinalIgnoreCase))
                {
                    int lastDotIndex = publicId.LastIndexOf('.');
                    if (lastDotIndex != -1)
                    {
                        publicId = publicId.Substring(0, lastDotIndex);
                    }
                }

                var deletionParams = new DeletionParams(publicId)
                {
                    ResourceType = resourceType switch
                    {
                        "image" => ResourceType.Image,
                        "video" => ResourceType.Video,
                        "raw" => ResourceType.Raw,
                        _ => ResourceType.Image
                    }
                };

                await _cloudinary.DestroyAsync(deletionParams);
            }
            catch
            {
            }
        }
    }
}
