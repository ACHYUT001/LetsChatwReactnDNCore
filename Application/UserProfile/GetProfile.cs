using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.UserProfile
{
    public class GetProfile
    {
        public class Query : IRequest<UserProfileDto>
        {
            public string UserName { get; set; }
        }
        public class Handler : IRequestHandler<Query, UserProfileDto>
        {
            private readonly DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this._userAccessor = userAccessor;

                _context = context;
            }

            public async Task<UserProfileDto> Handle(Query request, CancellationToken cancellationToken)
            {
                //Handler logic

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.UserName);
                if (user != null)
                {
                    return new UserProfileDto
                    {
                        DisplayName = user.DisplayName,
                        Username = user.UserName,
                        Image = user.Photos.FirstOrDefault(x => x.IsMain)?.URL,
                        Bio = user.Bio,
                        Images = user.Photos
                    };
                }

                throw new RestException(System.Net.HttpStatusCode.Unauthorized, new { User = "Not a registered user" });



            }
        }
    }
}