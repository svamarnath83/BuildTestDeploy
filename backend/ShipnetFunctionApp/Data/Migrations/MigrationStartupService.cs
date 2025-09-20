using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ShipnetFunctionApp.Data.Migrations
{
    /// <summary>
    /// Background service that ensures database migrations are applied on startup
    /// </summary>
    public class MigrationStartupService : IHostedService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<MigrationStartupService> _logger;
        
        public MigrationStartupService(
            IServiceProvider serviceProvider,
            ILogger<MigrationStartupService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }
        
        /// <summary>
        /// Called when the service starts - applies all pending migrations
        /// </summary>
        public async Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Starting MigrationStartupService...");

            try
            {
                using var scope = _serviceProvider.CreateScope();
                var migrationService = scope.ServiceProvider.GetRequiredService<DatabaseMigrationService>();

                _logger.LogInformation("Applying database migrations on startup...");
                await migrationService.MigrateAllDatabasesAsync();
                _logger.LogInformation("Database migrations successfully applied.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error applying database migrations on startup: {Message}", ex.Message);
                // Do not throw; keep the Functions host running
            }
        }
        
        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}
