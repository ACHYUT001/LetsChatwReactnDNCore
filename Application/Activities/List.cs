using System.Collections.Generic;
using MediatR;
using Domain;
using System.Threading.Tasks;
using System.Threading;
using Persistence;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace Application.Activities
{
    //This class will return a List of Activities
    public class List
    {
        public class Query : IRequest<List<ActivityDto>> { }
        public class Handler : IRequestHandler<Query, List<ActivityDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<List<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities = await _context.Activities
                .Include(x => x.UserActivities)
                .ThenInclude(x => x.AppUser)
                .ToListAsync();

                var activitiesToReturn = _mapper.Map<List<Activity>, List<ActivityDto>>(activities);
                return activitiesToReturn;
            }
        }
    }
}