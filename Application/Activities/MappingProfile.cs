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
                .ForMember(destinationMember => destinationMember.DisplayName, options => options.MapFrom(source => source.AppUser.DisplayName));

        }
    }
}