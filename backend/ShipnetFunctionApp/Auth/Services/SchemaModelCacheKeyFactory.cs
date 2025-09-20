using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using ShipnetFunctionApp.Data;

public class SchemaModelCacheKeyFactory : IModelCacheKeyFactory
{
    public object Create(DbContext context, bool designTime)
    {
        if (context is ShipnetDbContext dbContext)
        {
            // Include schema in cache key
            return (context.GetType(), dbContext.CurrentSchema, designTime);
        }
        return (context.GetType(), designTime);
    }
}
