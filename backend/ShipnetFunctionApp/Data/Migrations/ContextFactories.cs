using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;

namespace ShipnetFunctionApp.Data.Migrations
{
    /// <summary>
    /// Design-time DbContext factory for AdminContext migrations
    /// Used by EF Core tools to create migrations
    /// </summary>
    public class AdminContextFactory : IDesignTimeDbContextFactory<AdminContext>
    {
        public AdminContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? configuration["DefaultConnection"];
                
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("Database connection string 'DefaultConnection' not found.");
            }

            var optionsBuilder = new DbContextOptionsBuilder<AdminContext>();
            optionsBuilder.UseNpgsql(connectionString);

            return new AdminContext(optionsBuilder.Options);
        }
    }

    /// <summary>
    /// Design-time DbContext factory for MultiTenantSnContext migrations
    /// Used by EF Core tools to create migrations
    /// </summary>
    public class MultiTenantSnContextFactory : IDesignTimeDbContextFactory<MultiTenantSnContext>
    {
        public MultiTenantSnContext CreateDbContext(string[] args)
        {
            // Generate migrations WITHOUT a default schema so EF doesn't write a fixed schema in files
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? configuration["DefaultConnection"];
                
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("Database connection string 'DefaultConnection' not found.");
            }

            var optionsBuilder = new DbContextOptionsBuilder<MultiTenantSnContext>();
            optionsBuilder.UseNpgsql(connectionString);

            // Pass disableDefaultSchema=true so no default schema is set at design time
            return new MultiTenantSnContext(optionsBuilder.Options, schema: null, disableDefaultSchema: true);
        }
    }
}
