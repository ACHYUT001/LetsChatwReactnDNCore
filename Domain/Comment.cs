using System;
using System.Text.Json.Serialization;

namespace Domain
{
    public class Comment
    {
        public Guid Id { get; set; }
        public string Body { get; set; }
        public virtual AppUser Author { get; set; } //lazy loading

        // [JsonIgnore]
        public virtual Activity Activity { get; set; } //lazy loading
        public DateTime CreatedAt { get; set; }
    }
}