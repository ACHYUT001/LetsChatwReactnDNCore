using System;

namespace Domain
{
    //this entitiy symbolifies the join of user and Activity
    public class UserActivity
    {
        public string AppUserId { get; set; }

        //navigation property
        public virtual AppUser AppUser { get; set; }

        public Guid ActivityId { get; set; }

        //navigation property
        public virtual Activity Activity { get; set; }
        public DateTime DateJoined { get; set; }

        public bool IsHost { get; set; }
    }
}