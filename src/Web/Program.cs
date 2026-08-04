using Application;
using Application.Behaviors;
using Domain.Entities;
using Infrastructure;
using Infrastructure.Persistence.Contexts;
using Infrastructure.SignalR;
using MediatR;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Presentation;
using Presentation.Middleware;
using Serilog;
using System.Text;
using System.Text.Json;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDistributedMemoryCache();

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(60);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.Name = ".SocialAdmin.Session";
});
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

var ClientUrl = builder.Configuration["ClientUrl"];
Console.WriteLine($"Client Url {ClientUrl}");
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins(
                "https://localhost:765",   // Backend or Swagger UI
                 ClientUrl!    // Vite frontend
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

// Add JWT auth for the API + a Cookie scheme for MVC (admin) pages.
// JWT stays the default for Authenticate/Challenge/Forbid so existing API
// controllers continue to work with bearer tokens. The cookie scheme is the
// default for SignIn/SignOut so HttpContext.SignInAsync(...) works and the
// MVC admin area can be guarded with [Authorize(Roles = "ADMIN")].
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultForbidScheme      = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme            = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultSignInScheme      = "AdminCookie";
    options.DefaultSignOutScheme     = "AdminCookie";
})
.AddJwtBearer(options =>
{
    var jwtSettings = builder.Configuration.GetSection("Jwt");
    var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,

        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };

    // Prevent redirect from cookies
    options.Events = new JwtBearerEvents
    {
        OnChallenge = context =>
        {
            context.HandleResponse();
            context.Response.StatusCode = 401;
            return Task.CompletedTask;
        }
    };
})
.AddCookie("AdminCookie", options =>
{
    options.Cookie.Name = ".SocialAdmin.Auth";
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    options.ExpireTimeSpan = TimeSpan.FromHours(8);

    // Don't redirect on 401 — MVC actions return the login view instead.
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        return Task.CompletedTask;
    };
});

// Configure Identity
builder.Services.AddIdentityCore<User>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6;
    options.User.RequireUniqueEmail = true;
})
.AddRoles<IdentityRole<Guid>>()                  // add role support
.AddEntityFrameworkStores<AppDbContext>() // EF Core store
.AddDefaultTokenProviders();

// Override the lifetime of Identity's password-reset / email-confirm tokens.
// The default is 1 day, which is too long for a one-shot reset link — we
// want it short so a leaked token can't sit around waiting to be used.
// Lifespan is configurable via "Identity:ResetTokenLifespanMinutes" so
// ops can extend it in dev without a rebuild.
var resetMinutes = builder.Configuration.GetValue<int?>("Identity:ResetTokenLifespanMinutes") ?? 10;
builder.Services.Configure<DataProtectionTokenProviderOptions>(options =>
{
    options.TokenLifespan = TimeSpan.FromMinutes(resetMinutes);
});

// Bind SMTP options for the email service. The service itself falls
// back to log-only when the host is empty (dev / CI), so the app still
// boots without a configured mail provider.
builder.Services.Configure<Infrastructure.Services.SmtpOptions>(
    builder.Configuration.GetSection("Email:Smtp"));
builder.Services.AddScoped<Application.Abstractions.IEmailService, Infrastructure.Services.SmtpEmailService>();



// Add controllers (including external assembly)
builder.Services
    .AddControllersWithViews()
    .AddApplicationPart(typeof(Presentation.Controllers.AuthController).Assembly)
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

builder.Services.AddSignalR()
    .AddJsonProtocol(options =>
    {
        options.PayloadSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });



//Add Swagger 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // ✅ REQUIRED
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "My API",
        Version = "v1",
        Description = "API with JWT Authentication"
    });

    // ✅ JWT config
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {your token}"
    });

    // Add security requirement. Use concrete scheme object instead of an OpenApiReference
    options.AddSecurityRequirement(document => new()
    {
        [new OpenApiSecuritySchemeReference("Bearer", document)] = []
    });

// Swashbuckle 10 can't reflect [FromForm] IFormFile parameters by default.
    // MapType tells the schema generator how to render the type, and an
    // OperationFilter attaches a multipart/form-data request body. Both are required.
    options.MapType<Microsoft.AspNetCore.Http.IFormFile>(() => new Microsoft.OpenApi.OpenApiSchema
    {
        Type = Microsoft.OpenApi.JsonSchemaType.String,
        Format = "binary"
    });
    options.OperationFilter<Web.FileUploadOperationFilter>();
});

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();
builder.Host.UseSerilog();

//Add Authorization services
builder.Services.AddAuthorization();

// Configure MediatR and Pipeline Behaviors
builder.Services.AddScoped(typeof(IPipelineBehavior<,>), typeof(ValidationPipelineBehavior<,>));
builder.Services.AddApplicationDependencies()
                .AddInfrastructureDependencies()
                .AddPresentationDependencies();
var app = builder.Build();

app.UseCors("AllowLocalhost");


app.UseSerilogRequestLogging();
app.UseStaticFiles(); // <-- place here
app.UseSession();

// Middleware

if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // create document

    app.UseSwaggerUI(options =>
    {
        // Correct path for Swagger JSON
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
        options.RoutePrefix = string.Empty; // optional: serve UI at root "/"
    }); // indicate path for ui and json
    app.UseHttpsRedirection();
}
else
{
    app.UseHsts();
}

app.UseRouting();

app.UseAuthentication();
app.Use(async (context, next) =>
{
    if (context.User.Identity?.IsAuthenticated ?? false)
    {
        var claims = context.User.Claims.Select(c => $"{c.Type}:{c.Value}");
        Log.Information("Authenticated user claims: {Claims}", string.Join(", ", claims));
    }
    await next();
});

app.UseAuthorization();
app.UseUserLock();
app.MapStaticAssets(); // if you have static assets

app.MapHub<ChatHub>("hubs/chat");
app.MapHub<CallHub>("hubs/call");
app.MapHub<NotificationHub>("hubs/notifications");
app.MapControllers();   // map API controllers
app.Run();