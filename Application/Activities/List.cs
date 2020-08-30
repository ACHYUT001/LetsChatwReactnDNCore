using System.Collections.Generic;
using MediatR;
using Domain;
using System.Threading.Tasks;
using System.Threading;
using Persistence;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Application.Activities
{
    //This class will return a List of Activities
    public class List
    {
        public class Query:IRequest<List<Activity>>{}
        public class Handler : IRequestHandler<Query, List<Activity>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                this._context = context;
            }

            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities=  await _context.Activities.ToListAsync();
                return activities;
            }
        }
    }
}