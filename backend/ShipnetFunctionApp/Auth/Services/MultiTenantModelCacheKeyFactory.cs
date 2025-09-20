using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using ShipnetFunctionApp.Data;

namespace ShipnetFunctionApp.Auth.Services
{
    public class MultiTenantModelCacheKeyFactory : IModelCacheKeyFactory
    {
        public object Create(DbContext context, bool designTime)
        {
            if (context is MultiTenantSnContext dbContext)
            {
                // Include schema in cache key
                return (context.GetType(), dbContext.CurrentSchema, designTime);
            }
            return (context.GetType(), designTime);
        }
    }
}
