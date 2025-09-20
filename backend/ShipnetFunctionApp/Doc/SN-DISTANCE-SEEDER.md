# SN Distance Seeder

This document explains the SN Distance seeding functionality that has been implemented similar to the existing Port seeder.

## Overview

The SN Distance seeder (`SnDistanceSeeder`) provides efficient bulk loading of distance data between ports using PostgreSQL's `COPY` command, similar to how the `PortSeeder` works.

## Key Components

### 1. SnDistanceSeeder Class
- **Location**: `Data/Seed/SnDistanceSeeder.cs`
- **Purpose**: Provides bulk loading of SN Distance data from CSV files
- **Method**: `SeedSnDistanceFromCsvAsync(AdminContext ctx, Stream csvStream, CancellationToken ct = default)`

### 2. CSV Data File
- **Location**: `Data/Seed/sndistancedata.csv`
- **Format**: CSV with columns: `fromport`, `toport`, `distance`, `xmldata`
- **Embedded Resource**: Included as an embedded resource in the project

### 3. Database Integration
- **Table**: `sndistance` in the `public` schema (via AdminContext)
- **Context**: Uses `AdminContext` since distance data is system-wide, not tenant-specific

## CSV File Format

The CSV file should have the following structure:

```csv
fromport,toport,distance,xmldata
SINGAPORE,MUMBAI,3420,NULL
MUMBAI,SINGAPORE,3420,NULL
SINGAPORE,DUBAI,3850,NULL
...
```

### Column Descriptions:
- `fromport`: Source port name (string, max 100 chars)
- `toport`: Destination port name (string, max 100 chars)  
- `distance`: Distance in nautical miles (decimal)
- `xmldata`: Optional XML routing data (text, use NULL for empty)

## Automatic Seeding

The SN Distance data is automatically seeded during application startup through the `DatabaseMigrationService`:

1. **Startup Process**: When the application starts, `MigrateAllDatabasesAsync()` is called
2. **Admin Migration**: After migrating the admin database (public schema), `SeedAdminDataAsync()` is called
3. **Resource Loading**: The embedded CSV resource `sndistancedata.csv` is loaded
4. **Bulk Insert**: Data is bulk inserted using PostgreSQL COPY command
5. **Idempotent**: Only seeds if the table is empty (checked via `ctx.DistanceSources.AsNoTracking().AnyAsync()`)

## Performance Characteristics

- **Bulk Loading**: Uses PostgreSQL's `COPY FROM STDIN` for optimal performance
- **Memory Efficient**: Streams data in 64KB chunks to minimize memory usage
- **Connection Management**: Properly manages database connections
- **Error Handling**: Graceful error handling with detailed logging

## Architecture Decisions

### Why AdminContext?
- Distance data is system-wide, not tenant-specific
- Stored in the `public` schema alongside subscriptions and system configurations
- Accessed by the `DistanceService` which uses `AdminContext`

### Why Similar to PortSeeder?
- Consistent pattern with existing code
- Proven performance characteristics
- Similar data volume and structure
- Reuses established bulk loading techniques

### Automatic Only
- No manual seeding endpoint is provided
- Data is seeded automatically during application startup
- Simplifies deployment and reduces maintenance overhead

## Integration with Existing Code

The seeder integrates seamlessly with existing components:

- **DistanceService**: Continues to read from `AdminContext.DistanceSources`
- **PortFunction**: The `getPortDistance` endpoint continues to work unchanged
- **DatabaseMigrationService**: Includes SN distance seeding in the migration process
- **Configuration**: Added `sndistancedata.csv` as embedded resource

## Sample Data

The initial CSV includes common maritime routes between major ports:
- Singapore ? Mumbai, Dubai, Houston, Rotterdam, Tokyo, Shanghai
- Mumbai ? Dubai, Rotterdam, New York, Shanghai  
- Dubai ? Rotterdam, New York, Shanghai
- Various other bilateral routes

## Future Enhancements

Potential improvements for future versions:
1. **XML Routing Data**: Support for complex routing with waypoints
2. **Dynamic Updates**: API endpoints for adding/updating individual routes
3. **Route Calculation**: Integration with mapping services for automatic distance calculation
4. **Bulk Import**: Admin interface for uploading custom CSV files
5. **Route Optimization**: Algorithms for finding optimal routes with multiple waypoints

## Error Handling

The seeder includes comprehensive error handling:
- Database connection errors
- CSV parsing errors  
- PostgreSQL COPY command errors
- Resource loading errors
- Graceful fallback (continues even if seeding fails)

All errors are logged with appropriate detail for troubleshooting.

## Re-seeding Data

If you need to re-seed the distance data:
1. **Clear the table**: Execute `DELETE FROM public.sndistance;` in your database
2. **Restart the application**: The seeding will run automatically on startup
3. **Verify**: Check that the data has been loaded correctly

Alternatively, you can call the `DatabaseMigrationService.SeedAdminDataAsync()` method programmatically if needed.