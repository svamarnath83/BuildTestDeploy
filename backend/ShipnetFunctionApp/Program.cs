using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using ShipnetFunctionApp.Data;
using ShipnetFunctionApp.Registers.Services;
using Microsoft.EntityFrameworkCore.Infrastructure;
using ShipnetFunctionApp.Auth.Services;
using ShipnetFunctionApp.Thirdparty.Services;
using ShipnetFunctionApp.Api.Filters;
using ShipnetFunctionApp.Auth.DTOs;
using ShipnetFunctionApp.Data.Auditing;
using ShipnetFunctionApp.Services;
using ShipnetFunctionApp.Operations.Services;
using ShipnetFunctionApp.Chartering.Services;
using ShipnetFunctionApp.Services.Operation.Services;

var host = new HostBuilder()
    .ConfigureAppConfiguration(config =>
    {
        config.AddJsonFile("local.settings.json", optional: true, reloadOnChange: true);
        config.AddEnvironmentVariables();
    })
    .ConfigureFunctionsWorkerDefaults(worker =>
    {
        worker.UseMiddleware<ExceptionHandlingMiddleware>();
        worker.UseMiddleware<JwtValidationMiddleware>();
    })
    .ConfigureServices((context, services) =>
    {
        // Register IModelCacheKeyFactory for schema-aware model caching FIRST
        services.AddSingleton<IModelCacheKeyFactory, MultiTenantModelCacheKeyFactory>();

        // Get configuration
        var configuration = context.Configuration;

        // Add DbContextOptions for the factory
        var connectionString = configuration.GetConnectionString("DefaultConnection") 
                              ?? configuration["DefaultConnection"];
        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException("Database connection string 'DefaultConnection' not found.");
        }

        // 1. Register AdminContext (always uses public schema)
        services.AddDbContext<AdminContext>(options =>
        {
            options.UseNpgsql(connectionString, npgsqlOptions =>
            {
                npgsqlOptions.EnableRetryOnFailure(3, TimeSpan.FromSeconds(5), null);
                npgsqlOptions.CommandTimeout(30);
            });
            if (context.HostingEnvironment.IsDevelopment())
            {
                options.EnableSensitiveDataLogging();
                options.EnableDetailedErrors();
                // Enable SQL query logging
                options.LogTo(Console.WriteLine, Microsoft.Extensions.Logging.LogLevel.Information)
                       .EnableServiceProviderCaching()
                       .ConfigureWarnings(warnings => warnings.Log(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.MultipleCollectionIncludeWarning));
            }
        });

        // Interceptors
        services.AddScoped<AuditSaveChangesInterceptor>();

        // 2. Register MultiTenantSnContext with factory for dynamic schema
        services.AddDbContextFactory<MultiTenantSnContext>((sp, options) =>
        {
            options.UseNpgsql(connectionString, npgsqlOptions =>
            {
                npgsqlOptions.EnableRetryOnFailure(3, TimeSpan.FromSeconds(5), null);
                npgsqlOptions.CommandTimeout(30);
            });
            if (context.HostingEnvironment.IsDevelopment())
            {
                options.EnableSensitiveDataLogging();
                options.EnableDetailedErrors();
                // Enable SQL query logging
                options.LogTo(Console.WriteLine, Microsoft.Extensions.Logging.LogLevel.Information)
                       .EnableServiceProviderCaching()
                       .ConfigureWarnings(warnings => warnings.Log(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.MultipleCollectionIncludeWarning));
            }
            options.ReplaceService<IModelCacheKeyFactory, MultiTenantModelCacheKeyFactory>();

            // add auditing interceptor
            var auditInterceptor = sp.GetRequiredService<AuditSaveChangesInterceptor>();
            options.AddInterceptors(auditInterceptor);
        });

        services.AddTransient<Func<string, MultiTenantSnContext>>(sp =>
        {
            return (schema) =>
            {
                var optionsBuilder = new DbContextOptionsBuilder<MultiTenantSnContext>();

                var hasSearchPath = connectionString.Contains("Search Path=", StringComparison.OrdinalIgnoreCase) ||
                                    connectionString.Contains("SearchPath=", StringComparison.OrdinalIgnoreCase);
                var effectiveConnection = hasSearchPath
                    ? connectionString
                    : $"{connectionString};Search Path=\"{schema}\"";

                optionsBuilder.UseNpgsql(effectiveConnection, npgsqlOptions =>
                {
                    npgsqlOptions.EnableRetryOnFailure(3, TimeSpan.FromSeconds(5), null);
                    npgsqlOptions.CommandTimeout(30);
                    // Ensure migrations history is tracked per tenant schema
                    npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", schema);
                });

                if (context.HostingEnvironment.IsDevelopment())
                {
                    optionsBuilder.EnableSensitiveDataLogging();
                    optionsBuilder.EnableDetailedErrors();
                    // Enable SQL query logging
                    optionsBuilder.LogTo(Console.WriteLine, Microsoft.Extensions.Logging.LogLevel.Information)
                               .EnableServiceProviderCaching()
                               .ConfigureWarnings(warnings => warnings.Log(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.MultipleCollectionIncludeWarning));
                }

                optionsBuilder.ReplaceService<IModelCacheKeyFactory, MultiTenantModelCacheKeyFactory>();

                // add auditing interceptor (resolve from root service provider)
                var auditInterceptor = sp.GetRequiredService<AuditSaveChangesInterceptor>();
                optionsBuilder.AddInterceptors(auditInterceptor);

                return new MultiTenantSnContext(optionsBuilder.Options, schema);
            };
        });

        // Tenant services
        services.AddSingleton<ITenantContext, TenantContext>();
        services.AddScoped<TenantSchemaMiddleware>();
        services.AddScoped<ISchemaAccessor, SchemaAccessor>();
        services.AddScoped<AuthService>();
        services.AddScoped<PortService>();
        services.AddScoped<GradeService>();
        services.AddScoped<DistanceService>();
        services.AddScoped<EstimateService>();
        services.AddScoped<CurrencyTypeService>();
        services.AddScoped<UnitOfMeasureService>();
        services.AddScoped<CommodityService>();
        
        // Accounting services
        services.AddScoped<AccountGroupService>();
        services.AddScoped<AccountService>();
    
        services.AddScoped<VesselService>();
        services.AddScoped<VesselGradeService>();
        services.AddScoped<VesselTypeService>();
        services.AddScoped<UserService>();
        services.AddScoped<ActivityLogService>();
        services.AddScoped<ICurrentUserAccessor, CurrentUserAccessor>();
        services.AddScoped<AuditLogQueryService>();
        services.AddScoped<VoyageManagerService>();
        services.AddScoped<VoyageCargoService>();
        services.AddScoped<VoyagePortRotationService>();

        // Admin-wide services
        services.AddScoped<TideformBunkerPriceService>();

        // Logging
        services.AddLogging(builder =>
        {
            builder.AddConfiguration(configuration.GetSection("Logging"));
            if (context.HostingEnvironment.IsDevelopment())
            {
                builder.AddConsole();
                builder.AddDebug();
            }
        });

        // Database migration service (single source for all migrations)
        services.AddScoped<ShipnetFunctionApp.Data.Migrations.DatabaseMigrationService>(provider =>
        {
            var adminContext = provider.GetRequiredService<AdminContext>();
            var contextFactory = provider.GetRequiredService<IDbContextFactory<MultiTenantSnContext>>();
            var tenantContextFactory = provider.GetRequiredService<Func<string, MultiTenantSnContext>>();
            var logger = provider.GetRequiredService<ILogger<ShipnetFunctionApp.Data.Migrations.DatabaseMigrationService>>();
            return new ShipnetFunctionApp.Data.Migrations.DatabaseMigrationService(
                adminContext,
                contextFactory,
                tenantContextFactory,
                logger,
                configuration);
        });

        // JWT config/services
        var config = context.Configuration;
        services.AddSingleton(new JwtConfig
        {
            Issuer = config["Jwt:Issuer"],
            Audience = config["Jwt:Audience"],
            SecretKey = config["Jwt:SecretKey"],
            expiry = double.TryParse(config["Jwt:Expiry"], out var expiry) ? expiry : 1.0
        });
        services.AddSingleton<ShipnetFunctionApp.Auth.Services.JwtService>();
    })
    .Build();

// Single migration entrypoint for admin + all tenants
using (var scope = host.Services.CreateScope())
{
    var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>()
        .CreateLogger("StartupMigrations");
    var migrator = scope.ServiceProvider
        .GetRequiredService<ShipnetFunctionApp.Data.Migrations.DatabaseMigrationService>();

    try
    {
        logger.LogInformation("Running startup migrations...");
        await migrator.MigrateAllDatabasesAsync(); // Now includes seeding per tenant
        logger.LogInformation("Startup migrations completed.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Startup migrations failed.");
    }
}

await host.RunAsync();
