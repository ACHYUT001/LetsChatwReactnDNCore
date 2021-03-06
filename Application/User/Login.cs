using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;

namespace Application.User
{
    public class Login
    {
        public class Query : IRequest<User>
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(x => x.Email).NotEmpty();
                RuleFor(x => x.Password).NotEmpty();
            }
        }
        public class Handler : IRequestHandler<Query, User>
        {
            private readonly SignInManager<AppUser> _signInManager;
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;

            public Handler(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IJwtGenerator jwtGenerator)
            {
                _jwtGenerator = jwtGenerator;
                _userManager = userManager;
                _signInManager = signInManager;

            }

            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {

                //AppUser
                var user = await _userManager.FindByEmailAsync(request.Email);

                if (user == null)
                {
                    //if the user does not exist we return unauthoized
                    throw new RestException(HttpStatusCode.Unauthorized);
                }

                //if the email is valid and we are able to get a user by that email in our user table thanks to user manager
                //now we will use signinmanager to check password is valid or not, we can choose to lock out a user if failed attempts happens
                var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
                if (result.Succeeded)
                {
                    //ToDo generate Token
                    return new User
                    {
                        DisplayName = user.DisplayName,
                        Token = _jwtGenerator.CreateToken(user),
                        Username = user.UserName,
                        Image = user.Photos.FirstOrDefault(x => x.IsMain)?.URL
                    };

                }

                throw new RestException(HttpStatusCode.Unauthorized);

            }
        }
    }
}