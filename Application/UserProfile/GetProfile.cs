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


            private readonly IUserAccessor _userAccessor;
            private readonly IProfileReader _profileReader;

            public Handler(IProfileReader profileReader)
            {
                this._profileReader = profileReader;


            }

            public async Task<UserProfileDto> Handle(Query request, CancellationToken cancellationToken)
            {
                //Handler logic

                return await _profileReader.ReadProfile(request.UserName);
            }
        }
    }
}