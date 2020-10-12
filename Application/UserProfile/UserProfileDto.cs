using System.Collections.Generic;
using Domain;

namespace Application.UserProfile
{
    public class UserProfileDto
    {
        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string Image { get; set; }

        public string Bio { get; set; }

        public ICollection<Photo> Images { get; set; }
    }
}