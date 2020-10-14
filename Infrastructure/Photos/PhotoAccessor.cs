using System;
using System.IO;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Photos;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Persistence;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        // private readonly IUserAccessor _userAccessor;
        private readonly string _connectionString;

        private BlobServiceClient _blobServiceClient;
        private readonly DataContext _context;

        public PhotoAccessor(IConfiguration configuration)
        {


            _connectionString = configuration["Azure:PhotosBlobCS"];
            _blobServiceClient = new BlobServiceClient(_connectionString);

        }

        public async Task<PhotoUploadResult> AddPhoto(IFormFile file, string containerName)
        {
            //check if the photo has a container
            //we are using the name of the user as the name of the container
            //if the container already exists we use the container or we create a new one
            //then we upload the blob to the container




            //connect to the storage account


            //creates a new container if it doesnt exist
            var containerClient = _blobServiceClient.GetBlobContainerClient($"{containerName.ToLower()}");
            // var containerClient = new BlobContainerClient(_connectionString, $"${user}_{Guid.NewGuid()}");
            containerClient.CreateIfNotExists(Azure.Storage.Blobs.Models.PublicAccessType.BlobContainer);

            var blobClient = containerClient.GetBlobClient(Guid.NewGuid().ToString());


            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                { await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = file.ContentType }); }
            }


            return new PhotoUploadResult
            {
                Container = blobClient.BlobContainerName,
                Id = blobClient.Name,
                URL = blobClient.Uri.ToString()

            };

        }

        public async Task<bool> DeletePhoto(string name, string containerName)
        {
            //get access to the container 
            var containerClient = _blobServiceClient.GetBlobContainerClient($"{containerName.ToLower()}");



            return await containerClient.DeleteBlobIfExistsAsync(name);


        }
    }
}