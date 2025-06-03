using SpiceAPI.Auth;
using SpiceAPI.Helpers;
using Microsoft.EntityFrameworkCore;
using SpiceAPI.Models;
using Serilog;
using SpiceAPI;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration().MinimumLevel.Information().WriteTo.Console(outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss} [{Level:u3}] {Message:lj}{NewLine}{Exception}").CreateLogger();

string ConnectionString = $"{Environment.GetEnvironmentVariable("CONSTRING")}";
try
{
    string dbPass = Environment.GetEnvironmentVariable("DB_PASS") ?? "test";
    string dbHost = Environment.GetEnvironmentVariable("DB_HOST");
    string dbUser = Environment.GetEnvironmentVariable("DB_USER") ?? "spicegears";
    string dbName = Environment.GetEnvironmentVariable("DB_NAME") ?? "spicelab";

    if (dbHost == null) throw new Exception();
    string connectionString = $"Host={dbHost};Database={dbName};Username={dbUser};Password={dbPass};";

    Log.Information(connectionString);
    builder.Services.AddDbContext<DataContext>(options => options.UseNpgsql(connectionString));
    Log.Information("Postgres init complete");
}
catch (Exception)
{
    builder.Services.AddDbContext<DataContext>(options => options.UseSqlite("Filename=debug_database.db"));
    Log.Warning("Using SQLITE because of POSTGRES INIT ERROR");
}

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
        options.JsonSerializerOptions.WriteIndented = true; // Optional: For better readability
    });

builder.Services.AddDbContext<DataContext>(options => options.UseNpgsql());
//builder.Services.AddDbContext<DataContext>(options => options.UseSqlite("Filename=debug_database.db"));

// Add services to the container.
builder.Services.AddControllers(); // Ensure this line is present
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

//cors shit so it works anywhere
builder.Services.AddCors(options =>
{
    options.AddPolicy("F-off", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod(); // Needed if using cookies/tokens in requests
    });
});

//crypto service things
builder.Services.AddScoped<Crypto>();
builder.Services.AddScoped<SignatureCrypto>();
builder.Services.AddScoped<Token>();
//builder.Services.AddScoped<FileContext>();

// Load additional configuration from appsettings.Secret.json
builder.Configuration.AddJsonFile("appsettings.Secret.json", optional: true, reloadOnChange: true);

var app = builder.Build();
app.UseCors("F-off");



// Configure the HTTP request pipeline.




//if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "SpiceAPI V1");
    });
}

//
//DB SETUP
//
var scope = app.Services.CreateAsyncScope().ServiceProvider;
var db = scope.GetService<DataContext>();//apply migrations - auto-database mappings from Add-Migration command
await db.Database.MigrateAsync();


Guid supremeRoleId = new Guid("EEEEEEEE-EEEE-EEEE-EEEE-EEEEEEEEEEEE");
if (await db.Roles.FindAsync(supremeRoleId) == null) 
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
        Password = scope.GetService<Crypto>().Hash("qwerty"),
        Roles = new List<Role>()
    };
    user.Roles.Add(await db.Roles.FindAsync(supremeRoleId));
    Log.Information(Newtonsoft.Json.JsonConvert.SerializeObject(user));

    await db.Users.AddAsync(user);
    await db.SaveChangesAsync();
    Log.Logger.Warning("Created an Super User of login: ", user.Email);
}
else {
    User user = await db.Users.FindAsync(supremeRoleId);
    Log.Logger.Information("Super User exists, it's login is: ", user.Email); 
    Log.Information(Newtonsoft.Json.JsonConvert.SerializeObject(user.GetAllPermissions(db)));
}





app.UseHttpsRedirection();


app.MapControllers(); // Ensure this line is present

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
