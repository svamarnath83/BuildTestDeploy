## Migration Plan for ShipnetFunctionApp's DbContext Separation

This document outlines the steps to migrate from the single `ShipnetDbContext` to separate `MultiTenantSnContext` and `AdminContext` database contexts.

### 1. Service Migration Checklist

The following services need to be updated to use the appropriate context:

#### Services to use MultiTenantSnContext:
- [x] PortService
- [ ] GradeService
- [ ] DistanceService  
- [ ] EstimateService
- [ ] CurrencyTypeService
- [ ] UnitOfMeasureService
- [ ] CommodityService
- [ ] VesselService
- [ ] VesselGradeService
- [ ] VesselTypeService

#### Services to use AdminContext:
- [x] SchemaAccessor
- [x] TideformBunkerPriceService

### 2. Migration Steps for Each Service

For each service that currently uses `ShipnetDbContext`, follow these steps:

#### For MultiTenant Services:

1. Update the constructor parameters:
   ```csharp
   // Old
   private readonly ShipnetDbContext _context;
   private readonly Func<string, ShipnetDbContext> _dbContextFactory;
   
   // New
   private readonly MultiTenantSnContext _context;
   private readonly Func<string, MultiTenantSnContext> _dbContextFactory;
   ```

2. Update constructor initialization:
   ```csharp
   // Old
   public ServiceName(Func<string, ShipnetDbContext> dbContextFactory, ITenantContext tenantContext)
   
   // New
   public ServiceName(Func<string, MultiTenantSnContext> dbContextFactory, ITenantContext tenantContext)
   ```

3. No change needed to context usage in methods - the entity properties have the same names

#### For Admin Services:

1. Update to use AdminContext directly:
   ```csharp
   // Old
   private readonly ShipnetDbContext _context;
   private readonly Func<string, ShipnetDbContext> _dbContextFactory;
   
   // New
   private readonly AdminContext _adminContext;
   ```

2. Update constructor:
   ```csharp
   // Old
   public ServiceName(Func<string, ShipnetDbContext> dbContextFactory)
   
   // New
   public ServiceName(AdminContext adminContext)
   ```

3. Update entity access:
   ```csharp
   // Old
   _context.Configurations
   
   // New
   _adminContext.SystemConfigurations
   ```

### 3. Testing Plan

After migrating each service:

1. Compile the solution to ensure no compile errors
2. Run the affected endpoints to verify:
   - The correct context is used
   - Queries retrieve the expected data
   - Writes persist to the database correctly
   - For multi-tenant services: schema separation works correctly

### 4. Deployment Considerations

- Database schema remains unchanged
- No database migrations needed since the entity configurations are the same
- Separate connection pooling for admin vs. tenant operations may improve performance
