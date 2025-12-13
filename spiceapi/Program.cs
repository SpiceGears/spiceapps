using SpiceAPI.Auth;
using SpiceAPI.Helpers;
using Microsoft.EntityFrameworkCore;
using SpiceAPI.Models;
using Serilog;
using SpiceAPI;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using SpiceAPI.Services;
using Newtonsoft.Json;

var builder = WebApplication.CreateBuilder(args);

var prodenv = Environment.GetEnvironmentVariable("PRODUCTION");

//create logger for debugging etc.
Log.Logger = new LoggerConfiguration().MinimumLevel.Information().WriteTo.Console(outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss} [{Level:u3}] {Message:lj}{NewLine}{Exception}").CreateLogger();

string ConnectionString = $"{Environment.GetEnvironmentVariable("CONSTRING")}";
try
{
    string dbHost = Environment.GetEnvironmentVariable("DB_HOST") ?? "localhost";
    string dbPort = Environment.GetEnvironmentVariable("DB_PORT") ?? "5433";
    string dbUser = Environment.GetEnvironmentVariable("DB_USER") ?? "spicegears";
    string dbName = Environment.GetEnvironmentVariable("DB_NAME") ?? "spicelab";
    string dbPass = Environment.GetEnvironmentVariable("DB_PASS") ?? "test";

    string connectionString = $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUser};Password={dbPass};";
    
    Log.Information(connectionString);
    builder.Services.AddDbContext<DataContext>(options => options.UseNpgsql(connectionString));
    Log.Information("Postgres init complete");
}
catch (Exception)
{
    //on failure, fall back to SQLite
    builder.Services.AddDbContext<DataContext>(options => options.UseSqlite("Filename=debug_database.db"));
    Log.Warning("Using SQLITE because of POSTGRES INIT ERROR");
}

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles; //must be ignore cycles, otherwise there will be mismatch between API and frontend
        options.JsonSerializerOptions.WriteIndented = true; // Optional: For better readability
    });

builder.Services.AddDbContext<DataContext>(options => options.UseNpgsql()); //this line is duplicated for DB to migrate properly to target_db (POSTGRES in this case)
//builder.Services.AddDbContext<DataContext>(options => options.UseSqlite("Filename=debug_database.db"));
builder.Services.AddSignalR(); //required for real-time notifications

builder.Services.AddControllers(); // Ensure this line is present

if (string.IsNullOrWhiteSpace(prodenv) || prodenv != "true") //disable swagger if in production
{
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "SpiceAPI", Version = "v1" });

        // Define the custom header security scheme
        c.AddSecurityDefinition("Authorization", new OpenApiSecurityScheme
        {
            In = ParameterLocation.Header,
            Name = "Authorization",
            Type = SecuritySchemeType.ApiKey,
            Description = "Custom authorization header using the format 'ULogChallenge: username#password'"
        });

        // Register the operation filter that will add the security requirement to specific endpoints
        c.OperationFilter<AddAuthorizationHeaderFilter>();
    });
    Log.Logger.Warning("Swagger is enabled(build stage)!!!");
    Log.Logger.Warning((!string.IsNullOrWhiteSpace(prodenv) && prodenv == "true").ToString());
    Log.Logger.Warning($"{prodenv}");
}

//cors stuff so it works anywhere
builder.Services.AddCors(options =>
{
    options.AddPolicy("F-off", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

//crypto service things
builder.Services.AddScoped<Crypto>();
builder.Services.AddScoped<SignatureCrypto>();
builder.Services.AddScoped<Token>();
builder.Services.AddScoped<NotificationHelper>();
//builder.Services.AddScoped<FileContext>();

// Load additional configuration from appsettings.Secret.json (if any)
builder.Configuration.AddJsonFile("appsettings.Secret.json", optional: true, reloadOnChange: true);

var app = builder.Build();
app.UseCors("F-off");






//swagger setup, disabled in production
if (string.IsNullOrWhiteSpace(prodenv) || prodenv != "true")
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "SpiceAPI V1");
    });
    Log.Logger.Warning("Swagger is enabled!!!");
}



//
//DB SETUP
//
var scope = app.Services.CreateAsyncScope().ServiceProvider;
var db = scope.GetService<DataContext>();//apply migrations - auto-database mappings from Add-Migration command
await db.Database.MigrateAsync();


Guid supremeRoleId = new Guid("EEEEEEEE-EEEE-EEEE-EEEE-EEEEEEEEEEEE");
if (await db.Roles.FindAsync(supremeRoleId) == null) //create root-admin role
{
    Role su = new Role();
    su.Name = "Dominatum";
    su.Department = Department.NaDr;
    su.Scopes = new List<string>();
    su.Scopes.Add("admin");
    su.RoleId = supremeRoleId;
    await db.Roles.AddAsync(su);
    await db.SaveChangesAsync();
    Log.Logger.Warning("Created a supremium role of E");
} else { 
    Log.Logger.Information("Supremium role already exists");
    Log.Information(Newtonsoft.Json.JsonConvert.SerializeObject(db.Roles.Find(supremeRoleId).Scopes));
}

if (await db.Users.FindAsync(supremeRoleId) == null) 
{
    var pass = "qwerty";
    if (File.Exists("/etc/spicehub/preload/sudo.pas"))
    {
        pass = File.ReadLines("/etc/spicehub/preload/sudo.pas").First();
    }

    //create root user
    User user = new User() { BirthDay = DateOnly.Parse("2001-09-11"),
        Coin = 0,
        CreatedAt = DateTime.UtcNow,
        Department = Department.NaDr,
        Email = "admin@spicelab.net",
        FirstName = "Supremium",
        LastName = "Administrator",
        Id = supremeRoleId,
        IsApproved = true,
        LastLogin = DateTime.UtcNow,
        Password = scope.GetService<Crypto>().Hash(pass),
        Roles = new List<Role>()
    };
    user.Roles.Add(await db.Roles.FindAsync(supremeRoleId));
    Log.Information(Newtonsoft.Json.JsonConvert.SerializeObject(user));

    await db.Users.AddAsync(user);
    await db.SaveChangesAsync();
    Log.Logger.Warning("Created an Super User of login: ", user.Email);
}
else {
    User user = await db.Users.Include(u => u.Roles).FirstOrDefaultAsync(u => u.Id == supremeRoleId);
    if (user.Roles.FirstOrDefault(r => r.RoleId == supremeRoleId) == null) 
    {
        var role = await db.Roles.FindAsync(supremeRoleId);
        role.Users.Add(user);
        user.Roles.Add(role);
        await db.SaveChangesAsync();
        Log.Logger.Warning("Supremium lost dominatum role, reassigning");
    }
    Log.Logger.Information("Super User exists, it's login is: ", user.Email); 
    Log.Information(Newtonsoft.Json.JsonConvert.SerializeObject(user.GetAllPermissions(db)));
}

/// ROLE PRELOADER (DO NOT USE, IT IS BROKEN)
/*{
    if (File.Exists("/etc/spicehub/preload/roles.json"))
    {
        var fd = await File.ReadAllBytesAsync("/etc/spicehub/preload/roles.json");
        List<Role> roles = System.Text.Json.JsonSerializer.Deserialize<List<Role>>(fd);

        foreach (Role role in roles)
        {
            var existing = await db.Roles.FirstOrDefaultAsync(r => r.RoleId == role.RoleId);
            if (existing == null) {
                Role nr = new Role()
                {
                    RoleId = role.RoleId,
                    Name = role.Name,
                    Scopes = role.Scopes ?? new List<string>(),
                    Department = role.Department,
                };
                //db.Roles.Add(nr);
            }
        }
        //await db.SaveChangesAsync();
    }
}*/


app.UseHttpsRedirection();


app.MapControllers(); // Ensure this line is present
app.MapHub<NotificationsHub>("/realtime/notifications");

app.Run();

public class AddAuthorizationHeaderFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        // Add security requirements only if not already present
        if (operation.Security == null)
        {
            operation.Security = new List<OpenApiSecurityRequirement>();
        }

        // Define the optional security requirement
        var securityRequirement = new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Authorization"
                    },
                    In = ParameterLocation.Header,
                    Name = "Authorization"
                },
                new List<string>() // Empty list means optional
            }
        };

        operation.Security.Add(securityRequirement);
    }
}
