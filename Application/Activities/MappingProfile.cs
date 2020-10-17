using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Activities
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, ActivityDto>();
            CreateMap<UserActivity, AttendeeDto>()
                .ForMember(destinationMember => destinationMember.Username, options => options.MapFrom(source => source.AppUser))
                .ForMember(destinationMember => destinationMember.DisplayName, options => options.MapFrom(source => source.AppUser.DisplayName))
                .ForMember(destinationMember => destinationMember.Image, options => options.MapFrom(source => source.AppUser.Photos.FirstOrDefault(x => x.IsMain).URL))
                .ForMember(destinationMember => destinationMember.Following, options => options.MapFrom<FollowingResolver>());

        }
    }
}