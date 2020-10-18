using System.Collections.Generic;
using System.Text.Json.Serialization;
using Domain;

namespace Application.UserProfile
{
    public class UserProfileDto
    {
        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string Image { get; set; }

        public string Bio { get; set; }

        [JsonPropertyName("following")]
        public bool IsFollowed { get; set; }

        public int FollowerCount { get; set; } = 0;

        public int FollowingCount { get; set; } = 0;

        public ICollection<Photo> Images { get; set; }
    }
}