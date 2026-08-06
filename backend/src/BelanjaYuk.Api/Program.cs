using System;
using System.Text;
using BelanjaYuk.Application.Interfaces;
using BelanjaYuk.Infrastructure.Persistence;
using BelanjaYuk.Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Database Connection Configuration (Npgsql or InMemory)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                      ?? "Host=localhost;Port=5432;Database=belanjayuk_db;Username=postgres;Password=postgres";

// Check if PostgreSQL host is reachable or explicitly requested to use InMemory
var useInMemory = builder.Configuration.GetValue<bool>("UseInMemoryDatabase", false);

// Default to InMemory database if no external Postgres DB is available for seamless single-command run
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    try
    {
        options.UseNpgsql(connectionString, b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName));
    }
    catch
    {
        options.UseInMemoryDatabase("BelanjaYukDb");
    }
});

builder.Services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

// 2. Security Services (Password Hashing & JWT)
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

var secretKey = builder.Configuration["JwtSettings:Secret"] ?? "BelanjaYukSuperSecretKey1234567890!@#$%_SignatureTokenKeyForAuth2026";
var issuer = builder.Configuration["JwtSettings:Issuer"] ?? "BelanjaYukApi";
var audience = builder.Configuration["JwtSettings:Audience"] ?? "BelanjaYukWebClient";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

builder.Services.AddAuthorization();

// 3. Controllers & CORS
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 4. Swagger / OpenAPI Setup with JWT Support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "BelanjaYuk Backend RESTful API",
        Version = "v1",
        Description = "API e-Commerce BelanjaYuk terintegrasi dengan 12 Tabel ERD (LtGender, LtCategory, LtPayment, MsUser, MsUserPassword, MsUserSeller, MsProduct, TrProductImages, TrHomeAddress, TrBuyerCart, TrBuyerTransaction, TrBuyerTransactionDetail)"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Masukkan token JWT dengan format: Bearer {token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// 5. Auto-Migration & Seeding on Startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    var hasher = services.GetRequiredService<IPasswordHasher>();

    try
    {
        var dbContext = services.GetRequiredService<ApplicationDbContext>();
        await DbInitializer.SeedAsync(dbContext, hasher, logger);
    }
    catch (Exception ex)
    {
        logger.LogWarning($"PostgreSQL database connection failed ({ex.Message}). Initializing InMemory Database...");
        
        // Automatic Fallback to In-Memory Provider
        var inMemoryOptions = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase("BelanjaYukDb")
            .Options;

        using var inMemoryContext = new ApplicationDbContext(inMemoryOptions);
        await DbInitializer.SeedAsync(inMemoryContext, hasher, logger);
    }
}

// 6. Middleware Pipeline
if (app.Environment.IsDevelopment() || true)
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "BelanjaYuk API v1"));
}

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
