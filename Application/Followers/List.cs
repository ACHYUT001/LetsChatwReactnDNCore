using System.Collections.Generic;
using Application.UserProfile;
using MediatR;
using Persistence;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<List<UserProfileDto>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }


        public class Handler : IRequestHandler<Query, List<UserProfileDto>>
        {
            private readonly DataContext _context;
            private readonly IProfileReader _profileReader;

            public Handler(DataContext context, IProfileReader profileReader)
            {
                _profileReader = profileReader;
                _context = context;
            }



            public async Task<List<UserProfileDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryable = _context.Followings.AsQueryable();
                var userFollowings = new List<UserFollowing>();
                var profiles = new List<UserProfileDto>();

                switch (request.Predicate)
                {
                    case "followers":
                        {
                            userFollowings = await queryable.Where(x => x.Target.UserName == request.Username).ToListAsync();
                            foreach (var follower in userFollowings)
                            {
                                profiles.Add(await _profileReader.ReadProfile(follower.Observer.UserName));
                            }
                            break;
                        }

                    case "following":
                        {
                            userFollowings = await queryable.Where(x => x.Observer.UserName == request.Username).ToListAsync();
                            foreach (var follower in userFollowings)
                            {
                                profiles.Add(await _profileReader.ReadProfile(follower.Target.UserName));
                            }
                            break;
                        }
                }

                return profiles;
            }

        }
    }
}