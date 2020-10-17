using System.Linq;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.UserProfile
{
    public class ProfileReader : IProfileReader
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        public ProfileReader(DataContext context, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _context = context;

        }
        public async Task<UserProfileDto> ReadProfile(string username)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == username);

            if (user == null)
            {
                throw new RestException(System.Net.HttpStatusCode.NotFound, new { User = "User not found!" });


            }

            var currentUser = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

            var profile = new UserProfileDto
            {
                DisplayName = user.DisplayName,
                Username = user.UserName,
                Image = user.Photos.FirstOrDefault(x => x.IsMain)?.URL,
                Bio = user.Bio,
                Images = user.Photos,
                FollowerCount = user.Followers.Count,
                FollowingCount = user.Followings.Count

            };

            if (currentUser.Followings.Any(x => x.Target.Id == user.Id))
            {
                profile.IsFollowed = true;
            }

            return profile;
        }
    }
}