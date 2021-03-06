using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using API.Middleware;
using API.SignalR;
using Application.Activities;
using Application.Interfaces;
using Application.UserProfile;
using AutoMapper;
using Domain;
using FluentValidation.AspNetCore;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers(options =>
            {
                //build a new  policy
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                //makes sure to add the policy filter to the MVC Filters
                options.Filters.Add(new AuthorizeFilter(policy));
            }).AddFluentValidation(cfg =>
            {
                cfg.RegisterValidatorsFromAssemblyContaining<Create>();
            });
            // .AddNewtonsoftJson(x => x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);


            services.AddDbContext<DataContext>((options) =>
               {
                   options.UseLazyLoadingProxies();
                   options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
               }
            );


            services.AddCors((options) =>
            {
                options.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .WithOrigins("http://localhost:3000")
                        .AllowCredentials()
                        .WithExposedHeaders("WWW-Authenticate");
                });
            });


            services.AddMediatR(typeof(List.Handler).Assembly);
            services.AddAutoMapper(typeof(List.Handler));


            //Identity capability
            var builder = services.AddIdentityCore<AppUser>();
            var identitybuilder = new IdentityBuilder(builder.UserType, builder.Services);
            identitybuilder.AddEntityFrameworkStores<DataContext>();
            identitybuilder.AddSignInManager<SignInManager<AppUser>>();


            //Authentication

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenKey"]));
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opt =>
            {

                //to validate our token; our server will receive the token as a bearer and it will perform validation on these points
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateAudience = false,
                    ValidateIssuer = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                //for chat
                opt.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/chat")))
                        {
                            context.Token = accessToken;
                        }

                        return Task.CompletedTask;

                    }
                };
            });

            //Authorization

            //adding policy
            services.AddAuthorization((options) =>
            {
                options.AddPolicy("IsActivityHost", policy =>
                {
                    policy.Requirements.Add(new IsHostRequirement());
                });
            });


            //Adding SignalR
            services.AddSignalR();


            //adding the policy handler
            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();

            //add the service so that we can inject JwtGenerator
            services.AddScoped<IJwtGenerator, JwtGenerator>();

            //add username accessor 
            services.AddScoped<IUserAccessor, UserAccessor>();

            //Blob photo storage
            services.Configure<AzureBlobSettings>(Configuration.GetSection("Azure"));

            services.AddScoped<IPhotoAccessor, PhotoAccessor>();

            services.AddScoped<IProfileReader, ProfileReader>();



        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        //
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            //ordering of middlewares are very important
            //userouting and usecors should come first as they allow http request mathching with endpoint
            //then auth should be done as we need to authenticate the user and authorize before executing the matched endpoint
            //then mathched endpoints should be executed (controllers)
            app.UseMiddleware<ErrorHandlingMiddleware>();

            if (env.IsDevelopment())
            {
                // app.UseDeveloperExceptionPage();

            }
            else
            {
                app.UseHsts();
            }

            //Middleware for security headers
            //Prevent Content Sniffing
            app.UseXContentTypeOptions();

            //Restricts the amount of info passed to other sites when referring to other sites
            app.UseReferrerPolicy(options => options.NoReferrer());

            //stops pages from loading when they detected reflected cross-site scripting attacks
            app.UseXXssProtection(options => options.EnabledWithBlockMode());

            //prevents click jacking attacks, blocks Iframe
            app.UseXfo(options => options.Deny());


            app.UseCsp(options => options
            //prevents loading any assest using http, when the page is loaded using https
            .BlockAllMixedContent()

            .StyleSources(source => source.Self().CustomSources("https://fonts.googleapis.com", "sha256-ehIZssCI9aFwLKilYPBVNPepuv/8QZCaoUnZVz4zepg="))
            .FontSources(source => source.Self().CustomSources("https://fonts.gstatic.com/", "data:"))
            .FormActions(source => source.Self())
            .FrameAncestors(source => source.Self())
            .ImageSources(source => source.Self().CustomSources("https://letschatsa.blob.core.windows.net", "blob:", "data:"))
            .ScriptSources(source => source.Self().CustomSources("sha256-ma5XxS1EBgt17N22Qq31rOxxRWRfzUTQS1KOtfYwuNo="))
            );









            //app.UseHttpsRedirection();


            app.UseDefaultFiles();

            app.UseStaticFiles();

            //UseRouting matches request to a endpoint
            app.UseRouting();

            //enables cors policy
            app.UseCors("CorsPolicy");

            //adds Auth
            app.UseAuthentication();
            app.UseAuthorization();

            //executes the matched endpoint
            app.UseEndpoints(endpoints =>
            {
                //maps requests based on controllers
                endpoints.MapControllers();
                //whenever a request comes in for /chat endpoint it gets directed to the ChatHub
                endpoints.MapHub<ChatHub>("/chat");
                endpoints.MapFallbackToController("Index", "Fallback");

                // endpoints.MapFallbackToController("Index", "Fallback");
            });
        }
    }
}
