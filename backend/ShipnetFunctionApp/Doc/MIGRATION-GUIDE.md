# Shipnet 2.0 Database Migration Guide

This guide explains how to work with the automated database migration system in Shipnet 2.0. The migration system provides the following features:

- Automatically creates missing tables when new entities are added
- Automatically adds new columns when entity models are updated
- Supports per-tenant schema migrations
- Runs migrations on startup to ensure the database is always in sync
- Provides manual migration triggers through HTTP endpoints
- **NEW: Proper schema replacement for tenant migrations**

## Architecture

The migration system works with two separate database contexts:

1. **AdminContext**: Manages the `public` schema containing system-wide tables:
   - Subscriptions (tenant information)
   - System configurations

2. **MultiTenantSnContext**: Manages tenant-specific schemas containing business data:
   - Ports, Vessels, Grades, etc.
   - Each tenant gets its own isolated schema

## Schema Replacement Fix

**Issue Fixed**: Previously, when creating new tenant schemas, the migration files contained hardcoded "template" schema references that were not being replaced with the actual tenant schema names, resulting in tables being created in the wrong schema.

**Solution**: The `DatabaseMigrationService` now uses a custom `SchemaReplacingSqlGenerator` that:
- Replaces all "template" schema references with the target tenant schema name
- Ensures tables are created in the correct tenant schema
- Maintains proper isolation between tenants

### Technical Implementation

The fix involves:

1. **SchemaReplacingSqlGenerator**: A custom SQL generator that replaces schema names in migration operations
2. **Enhanced DatabaseMigrationService**: Creates contexts with the schema replacement generator
3. **Proper Service Configuration**: Uses a custom service provider for migration contexts

```csharp
// The SchemaReplacingSqlGenerator replaces migration operations like:
migrationBuilder.CreateTable("commodities", schema: "template", ...)
// With:
migrationBuilder.CreateTable("commodities", schema: "client_abc", ...)
```

## Automatic Migrations

Database migrations are automatically applied:
- When the application starts via the `MigrationStartupService`
- First for the `AdminContext` (public schema)
- Then for each tenant schema found in the Subscriptions table
- **NEW: With proper schema replacement for tenant migrations**

## Creating Migrations

When you make changes to entity models, you need to create new migrations. Use the provided script:

```powershell
# From the ShipnetFunctionApp directory
$env:DefaultConnection = "Host=10.91.20.72;Port=5432;Database=voyage;Username=postgres;Password=postgres"
./generate-migrations.sh <migration-name>
```

This script generates migrations for both contexts:
- `AdminContext` migrations in `Data/Migrations/AdminMigrations`
- `MultiTenantSnContext` migrations in `Data/Migrations/TenantMigrations`

**Note**: Tenant migrations will use "template" as the schema name in the migration files, but this will be automatically replaced with the actual tenant schema name when applied.

## Manual Migration Triggers

The application provides HTTP endpoints to manually trigger migrations:

1. **Migrate All Databases**:
   - URL: `POST /api/migrations/all`
   - Migrates both the admin database and all tenant schemas
   - Requires admin-level authorization

2. **Migrate a Specific Tenant Schema**:
   - URL: `POST /api/migrations/tenant/{schema}`
   - Migrates only the specified tenant schema
   - Requires admin-level authorization

3. **Create a New Tenant Schema**:
   - URL: `POST /api/migrations/tenant/create/{schema}`
   - Creates a new schema and applies all migrations
   - **NEW: Properly replaces template schema with target schema**
   - Requires admin-level authorization

## Adding a New Tenant

To add a new tenant:

1. Create a record in the `Subscriptions` table with:
   - Username
   - AccountCode
   - Schema name (must be unique and not "public")

2. Call the Create Tenant Schema endpoint:
   ```
   POST /api/migrations/tenant/create/{schema}
   ```

3. The system will:
   - Create the schema if it doesn't exist
   - Apply all migrations to the new schema
   - **NEW: Properly create tables in the tenant schema (not template)**

## Development Workflow

When making database schema changes:

1. Update entity model classes or configurations
2. Generate migrations using `./generate-migrations.sh "Description of changes"`
3. Review the generated migration files to ensure they're correct
4. Deploy the application - migrations will apply automatically on startup

## Troubleshooting

If migrations fail:

1. Check application logs for detailed error messages
2. Ensure the database user has permissions to create schemas and tables
3. If needed, manually trigger migrations using the HTTP endpoints
4. For complex migration issues, use the EF Core command line tools:
   ```
   dotnet ef database update --context AdminContext
   ```

## Testing the Schema Fix

To verify the schema replacement is working correctly:

1. Create a test tenant schema:
   ```
   POST /api/migrations/tenant/create/test_tenant
   ```

2. Check the database to ensure tables were created in the `test_tenant` schema, not `template`

3. Verify the migration history table exists in the correct schema

## Best Practices

1. Make small, incremental changes to the database schema
2. Always generate migrations after model changes
3. Test migrations in a development environment before deploying to production
4. Use nullable columns when adding new fields to existing tables
5. Be cautious with renaming or deleting columns - provide data migration paths
6. **NEW: Verify tenant isolation by checking that tables are created in the correct schemas**
