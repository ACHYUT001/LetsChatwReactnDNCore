using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Profiles;
using Application.UserProfile;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfileController : BaseController
    {

        [HttpGet("{userName}")]
        public async Task<ActionResult<UserProfileDto>> getProfile(string username)
        {
            return await Mediator.Send(new GetProfile.Query { UserName = username });
        }



        [HttpPut]
        public async Task<ActionResult<Unit>> updateProfile(EditProfile.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet("{username}/activities")]

        public async Task<ActionResult<List<UserActivityDto>>> GetUserActivities(string username, string predicate)
        {
            return await Mediator.Send(new ListActivities.Query { Username = username, Predicate = predicate });
        }


    }
}