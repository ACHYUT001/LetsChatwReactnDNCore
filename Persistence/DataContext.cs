using System;
using Microsoft.EntityFrameworkCore;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Value> Values { get; set; }

        public DbSet<Activity> Activities { get; set; }

        public DbSet<UserActivity> UserActivities { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Value>()
                .HasData(
                    new Value { Id = 1, Name = "Value 101" },
                    new Value { Id = 2, Name = "Value 102" },
                    new Value { Id = 3, Name = "Value 103" }
                );

            //definining the primary key
            builder.Entity<UserActivity>((x) =>
                x.HasKey(ua => new { ua.AppUserId, ua.ActivityId }));

            //defining the relationship
            builder.Entity<UserActivity>()
                .HasOne(ua => ua.AppUser)
                .WithMany(au => au.UserActivities)
                .HasForeignKey(ua => ua.AppUserId);

            //note how we are using the Activity and AppUser Object defined in the UserActivity entity to make the connection
            builder.Entity<UserActivity>()
                .HasOne(ua => ua.Activity)
                .WithMany(activity => activity.UserActivities)
                .HasForeignKey(ua => ua.ActivityId);


        }
    }
}
