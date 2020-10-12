using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest
        {
            //props
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _photoAccessor = photoAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                //handler logic 
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                var photo = user.Photos.SingleOrDefault(x => x.Id == request.Id);
                if (photo.IsMain)
                {
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, new { Photos = "Cannot delete main photo" });
                }

                var result = await _photoAccessor.DeletePhoto(request.Id, user.UserName);

                if (result == true)
                {
                    user.Photos.Remove(photo);
                    var success = await _context.SaveChangesAsync() > 0;

                    if (success) return Unit.Value;
                }




                throw new Exception("Problem Deleting Photos, not found");


            }

        }
    }
}