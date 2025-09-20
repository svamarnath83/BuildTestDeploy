# VoyageHeader Service Implementation

## Summary

A complete VoyageHeaderService has been created following the established patterns in the Shipnet 2.0 workspace.

## Created Files

### 1. **VoyageHeaderDto.cs** - `Services/Chartering/DTOs/VoyageHeaderDto.cs`
- Complete DTO with all VoyageHeader properties
- Navigation properties for PortRotations and Cargos
- Supports both basic and detailed views

### 2. **VoyageHeaderService.cs** - `Services/Chartering/Services/VoyageHeaderService.cs`
- Inherits from BaseService following workspace patterns
- Implements unified `AddOrUpdateAsync` method (no separate create/update)
- Includes all CRUD operations
- Advanced features:
  - Automatic voyage number generation
  - Voyage number uniqueness validation
  - Status management
  - Related data loading (port rotations and cargos)
  - Soft delete (sets status to 'Cancelled')
  - Hard delete option

### 3. **VoyageHeaderFunction.cs** - `Api/Operations/VoyageHeaderFunction.cs`
- Complete Azure Functions implementation
- RESTful API endpoints
- Follows workspace patterns for error handling and responses

### 4. **Updated MultiTenantSnContext.cs**
- Added VoyageHeaders DbSet
- Added VoyageHeaderConfiguration
- Maintains existing patterns

## API Endpoints

### **VoyageHeader Management:**
- `GET /api/voyage-headers` - Get all with filtering by vessel, status, and related data
- `GET /api/voyage-headers/{id}` - Get by ID with optional related data
- `GET /api/voyage-headers/by-voyage-no/{voyageNo}` - Get by voyage number
- `GET /api/vessels/{vesselId}/voyage-headers` - Get all voyages for a vessel
- `POST /api/voyage-headers/save` - **Unified create/update**
- `PATCH /api/voyage-headers/{id}/status` - Update status only
- `DELETE /api/voyage-headers/{id}` - Soft delete (sets status to 'Cancelled')
- `DELETE /api/voyage-headers/{id}/permanent` - Hard delete

### **Utility Endpoints:**
- `GET /api/vessels/{vesselId}/generate-voyage-number` - Generate unique voyage number
- `GET /api/voyage-headers/check-voyage-number/{voyageNo}` - Check if voyage number exists

## Key Features

### **Unified Create/Update Pattern**
```csharp
// Creates if Id = 0, updates if Id > 0
var result = await voyageHeaderService.AddOrUpdateAsync(voyageHeaderDto);
```

### **Automatic Voyage Number Generation**
- Format: `{VesselCode}-{Year}-{SequentialNumber}`
- Example: `ABC-2025-001`, `ABC-2025-002`
- Unique per vessel per year

### **Related Data Loading**
```csharp
// Load voyage with port rotations and cargos
var voyage = await voyageHeaderService.GetByIdAsync(id, includeRelated: true);
```

### **Status Management**
- Default status: "Planning"
- Soft delete sets status to "Cancelled"
- Dedicated status update endpoint

### **Filtering Options**
- Filter by vessel ID
- Filter by status
- Include/exclude related data
- Order by creation date (newest first)

## Database Integration

The service is fully integrated with the existing database structure:
- Uses existing VoyageHeader model and configuration
- Leverages existing VoyagePortrotation and Voyagecargo relationships
- Follows multi-tenant schema patterns
- Supports automatic migrations

## Usage Examples

### **Create a new voyage:**
```csharp
var dto = new VoyageHeaderDto
{
    VesselId = 123,
    Status = "Planning",
    VoyageStartDate = DateTime.UtcNow,
    // VoyageNo will be auto-generated if not provided
};
var created = await service.AddOrUpdateAsync(dto);
```

### **Update existing voyage:**
```csharp
var dto = new VoyageHeaderDto
{
    Id = 456, // Existing voyage ID
    VesselId = 123,
    Status = "Active",
    VoyageEndDate = DateTime.UtcNow.AddDays(30)
};
var updated = await service.AddOrUpdateAsync(dto);
```

### **Get voyage with related data:**
```csharp
var voyage = await service.GetByIdAsync(456, includeRelated: true);
// voyage.PortRotations and voyage.Cargos will be populated
```

## Next Steps

To complete the implementation, you'll need to:

1. **Run Migration:**
   ```bash
   dotnet ef migrations add VoyageHeaderServiceAdd --context MultiTenantSnContext --output-dir Data/Migrations/TenantMigrations
   ```

2. **Register Service in DI Container** (if not already done):
   ```csharp
   services.AddScoped<VoyageHeaderService>();
   ```

3. **Test the endpoints** using the provided API routes

The service is now ready for use and follows all established patterns in the Shipnet 2.0 workspace!