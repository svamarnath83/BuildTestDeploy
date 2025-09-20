using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using ShipnetFunctionApp.Api.Filters;
using ShipnetFunctionApp.Data.Migrations;
using System.Net;
using System.Threading.Tasks;

namespace ShipnetFunctionApp.Api
{
    /// <summary>
    /// HTTP Functions for manually triggering database migrations
    /// </summary>
    public class MigrationFunction
    {
        private readonly DatabaseMigrationService _migrationService;
        private readonly ILogger<MigrationFunction> _logger;
        
        public MigrationFunction(
            DatabaseMigrationService migrationService,
            ILogger<MigrationFunction> logger)
        {
            _migrationService = migrationService;
            _logger = logger;
        }
        
        /// <summary>
        /// HTTP trigger to migrate all databases (admin and tenant schemas)
        /// </summary>
        [Function("MigrateAllDatabases")]
        public async Task<HttpResponseData> MigrateAllDatabases(
            [HttpTrigger(AuthorizationLevel.Admin, "post", Route = "migrations/all")] HttpRequestData req)
        {
            _logger.LogInformation("MigrateAllDatabases function triggered");
            
            await _migrationService.MigrateAllDatabasesAsync();
            
            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteStringAsync("Database migrations completed successfully.");
            return response;
        }
        
        /// <summary>
        /// HTTP trigger to migrate a specific tenant schema
        /// </summary>
        [Function("MigrateTenantSchema")]
        public async Task<HttpResponseData> MigrateTenantSchema(
            [HttpTrigger(AuthorizationLevel.Admin, "post", Route = "migrations/tenant/{schema}")] HttpRequestData req,
            string schema)
        {
            _logger.LogInformation("MigrateTenantSchema function triggered for schema: {Schema}", schema);
            
            await _migrationService.MigrateTenantSchemaAsync(schema);
            
            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteStringAsync($"Database migrations for schema '{schema}' completed successfully.");
            return response;
        }
        
        /// <summary>
        /// HTTP trigger to create a new tenant schema and apply migrations
        /// </summary>
        [Function("CreateTenantSchema")]
        public async Task<HttpResponseData> CreateTenantSchema(
            [HttpTrigger(AuthorizationLevel.Admin, "post", Route = "migrations/tenant/create/{schema}")] HttpRequestData req,
            string schema)
        {
            _logger.LogInformation("CreateTenantSchema function triggered for schema: {Schema}", schema);
            
            await _migrationService.CreateAndMigrateTenantSchemaAsync(schema);
            
            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteStringAsync($"Tenant schema '{schema}' created and migrations applied successfully.");
            return response;
        }
    }
}
