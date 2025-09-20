using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ShipnetFunctionApp.Data.Seed;

namespace ShipnetFunctionApp.Data.Migrations
{
    public class DatabaseMigrationService
    {
        private readonly AdminContext _adminContext;
        private readonly ILogger<DatabaseMigrationService> _logger;
        private readonly Func<string, MultiTenantSnContext> _tenantContextFactory;
        private readonly IConfiguration _configuration;
        
        public DatabaseMigrationService(
            AdminContext adminContext,
            IDbContextFactory<MultiTenantSnContext> _ /* not used */,
            Func<string, MultiTenantSnContext> tenantContextFactory,
            ILogger<DatabaseMigrationService> logger,
            IConfiguration configuration)
        {
            _adminContext = adminContext;
            _tenantContextFactory = tenantContextFactory;
            _logger = logger;
            _configuration = configuration;
        }
        
        public async Task MigrateAllDatabasesAsync()
        {
            _logger.LogInformation("Starting database migrations...");
            try
            {
                // Admin (public)
                _logger.LogInformation("Migrating admin database (public schema)...");
                await _adminContext.Database.MigrateAsync();
                
                // Seed SN Distance data for Admin context (public schema)
                await SeedAdminDataAsync();

                // Tenants
                _logger.LogInformation("Fetching tenant schemas...");
                var schemas = await GetAllSchemasAsync();
                foreach (var schema in schemas)
                {
                    try
                    {
                        await MigrateTenantSchemaAsync(schema);
                        _logger.LogInformation("Migration completed for schema: {Schema}", schema);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error migrating schema {Schema}: {Message}", schema, ex.Message);
                    }
                }
                _logger.LogInformation("Database migrations completed successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during database migration: {Message}", ex.Message);
                throw;
            }
        }

        /// <summary>
        /// Seeds admin context data (public schema) including SN Distance data
        /// </summary>
        private async Task SeedAdminDataAsync()
        {
            try
            {
                var asm = typeof(SnDistanceSeeder).Assembly;
                var distanceResName = asm.GetManifestResourceNames()
                    .FirstOrDefault(n => n.EndsWith(".csv", StringComparison.OrdinalIgnoreCase) &&
                                         n.Contains("distanceData", StringComparison.OrdinalIgnoreCase));

                if (distanceResName != null)
                {
                    using var stream = asm.GetManifestResourceStream(distanceResName);
                    if (stream != null)
                    {
                        _logger.LogInformation("Seeding SN Distance data from embedded resource {Resource}", distanceResName);
                        await SnDistanceSeeder.SeedSnDistanceFromCsvAsync(_adminContext, stream);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SN Distance seeding failed. Continuing.", ex);
            }
        }

        private async Task<IEnumerable<string>> GetAllSchemasAsync()
        {
            var subscriptions = await _adminContext.Subscriptions
                .AsNoTracking()
                .ToListAsync();
            return subscriptions
                .Where(s => !string.IsNullOrWhiteSpace(s.Schema) && !s.Schema.Equals("public", StringComparison.OrdinalIgnoreCase))
                .Select(s => s.Schema);
        }

        public async Task MigrateTenantSchemaAsync(string schema)  
        {
            if (string.IsNullOrWhiteSpace(schema) || schema.Equals("public", StringComparison.OrdinalIgnoreCase))
                throw new ArgumentException("Invalid schema name for tenant migration.", nameof(schema));

            await EnsureSchemaExistsAsync(schema);

            using var context = _tenantContextFactory(schema);

            // Log what EF thinks
            var all = context.Database.GetMigrations();
            var pendingBefore = await context.Database.GetPendingMigrationsAsync();
            _logger.LogInformation("All migrations discovered for {Schema} ({Count}): {List}",
                schema, all.Count(), string.Join(", ", all));
            _logger.LogInformation("Pending migrations BEFORE for {Schema} ({Count}): {List}",
                schema, pendingBefore.Count(), string.Join(", ", pendingBefore));

            // Always migrate (idempotent)
            await context.Database.MigrateAsync();
            
            // Seed runtime data only if not already seeded (idempotent check)
            var hasAccountGroups = await context.AccountGroups.AnyAsync();
            if (!hasAccountGroups)
            {
                await context.SeedAccountGroupsAsync();
            }
            
            // Verify
            var pendingAfter = await context.Database.GetPendingMigrationsAsync();
            if (pendingAfter.Any())
            {
                _logger.LogWarning("Pending migrations AFTER for {Schema} ({Count}): {List}",
                    schema, pendingAfter.Count(), string.Join(", ", pendingAfter));
            }
            else
            {
                _logger.LogInformation("No pending migrations for {Schema} after migrate.", schema);
            }

            // Seed ports from embedded CSV (optional) � only if table is empty
            try
            {
                var asm = typeof(PortSeeder).Assembly;
                var resName = asm.GetManifestResourceNames()
                    .FirstOrDefault(n => n.EndsWith(".csv", StringComparison.OrdinalIgnoreCase) &&
                                         n.Contains("portsdata", StringComparison.OrdinalIgnoreCase));

                if (resName != null)
                {
                    using var stream = asm.GetManifestResourceStream(resName);
                    if (stream != null)
                    {
                        _logger.LogInformation("Seeding ports for schema {Schema} from embedded resource {Resource}", schema, resName);
                        await PortSeeder.SeedPortsFromCsvAsync(context, stream);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ports seeding failed for {Schema}. Continuing.", schema);
            }
        }

        private async Task EnsureSchemaExistsAsync(string schema)
        {
            if (!System.Text.RegularExpressions.Regex.IsMatch(schema, "^[a-zA-Z0-9_]+$"))
                throw new ArgumentException("Invalid schema name format. Schema names can only contain letters, numbers, and underscores.");

            var sql = $"CREATE SCHEMA IF NOT EXISTS \"{schema}\"";
            await _adminContext.Database.ExecuteSqlRawAsync(sql);
        }

        public async Task CreateAndMigrateTenantSchemaAsync(string schema)
        {
            if (string.IsNullOrWhiteSpace(schema) || schema.Equals("public", StringComparison.OrdinalIgnoreCase))
                throw new ArgumentException("Invalid schema name for tenant creation.", nameof(schema));

            _logger.LogInformation("Creating new tenant schema: {Schema}", schema);
            await EnsureSchemaExistsAsync(schema);
            await MigrateTenantSchemaAsync(schema);
        }
    }
}
