

using System.Collections.Generic;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }

        public string Bio { get; set; }

        // [JsonIgnore]
        public virtual ICollection<UserActivity> UserActivities { get; set; }

        public virtual ICollection<Photo> Photos { get; set; }

        public virtual ICollection<UserFollowing> Followings { get; set; }

        public virtual ICollection<UserFollowing> Followers { get; set; }


    }
}