using System;
using System.IO;
using System.Threading.Tasks;
using Application.Photos;
using Microsoft.AspNetCore.Http;



namespace Application.Interfaces
{
    public interface IPhotoAccessor
    {
        Task<PhotoUploadResult> AddPhoto(IFormFile file, string containerName);

        Task<bool> DeletePhoto(string name, string containerName);
    }
}