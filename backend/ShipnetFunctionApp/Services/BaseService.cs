using Microsoft.Extensions.Logging;
using ShipnetFunctionApp.Auth.Services;
using ShipnetFunctionApp.Data;

namespace ShipnetFunctionApp.Services
{
    /// <summary>
    /// Base service class that handles common context functionality for all services
    /// </summary>
    public abstract class BaseService
    {
        private readonly Func<string, MultiTenantSnContext> _dbContextFactory;
        protected readonly ITenantContext _tenantContext;
        protected readonly ILogger? _logger;

        // Private backing field for context property
        private MultiTenantSnContext? _contextInstance;
        
        /// <summary>
        /// Gets the current DB context with the proper tenant schema
        /// This will create a new context if needed when the schema changes
        /// </summary>
        protected MultiTenantSnContext _context
        {
            get
            {
                // Always return a context with the current schema
                if (_contextInstance == null || _contextInstance.CurrentSchema != _tenantContext.Schema)
                {
                    // Dispose previous context if it exists
                    if (_contextInstance != null)
                    {
                        _logger?.LogDebug("Schema changed from {OldSchema} to {NewSchema}, refreshing context", 
                            _contextInstance.CurrentSchema, _tenantContext.Schema);
                        _contextInstance.Dispose();
                    }
                    
                    // Create new context with current schema
                    _contextInstance = _dbContextFactory(_tenantContext.Schema);
                }
                
                return _contextInstance;
            }
        }

        /// <summary>
        /// Initializes a new instance of the base service class
        /// </summary>
        /// <param name="dbContextFactory">Factory to create database contexts</param>
        /// <param name="tenantContext">Tenant context for schema information</param>
        /// <param name="logger">Optional logger instance</param>
        protected BaseService(
            Func<string, MultiTenantSnContext> dbContextFactory,
            ITenantContext tenantContext,
            ILogger? logger = null)
        {
            _dbContextFactory = dbContextFactory ?? throw new ArgumentNullException(nameof(dbContextFactory));
            _tenantContext = tenantContext ?? throw new ArgumentNullException(nameof(tenantContext));
            _logger = logger;
        }
        
        // Add finalizer to clean up context
        ~BaseService()
        {
            _contextInstance?.Dispose();
        }
    }
}
