# Ship Validation Schemas

This directory contains comprehensive Zod validation schemas for all ship-related data in the application.

## Overview

The validation schemas ensure data integrity and provide clear error messages for ship-related operations including:
- Vessel management
- Port calls and scheduling
- Bunker consumption and rates
- Financial metrics
- Ship analysis

## Available Schemas

### Core Vessel Schemas

- **`vesselSchema`** - Main vessel validation schema
- **`vesselGradeSchema`** - Vessel grade validation
- **`speedConsumptionItemSchema`** - Speed and consumption data validation
- **`vesselJsonSchema`** - Vessel JSON data validation

### Request/Response Schemas

- **`createShipRequestSchema`** - Ship creation request validation
- **`updateShipRequestSchema`** - Ship update request validation
- **`shipFiltersSchema`** - Ship search filters validation
- **`shipListResponseSchema`** - Ship list response validation

### Operations App Schemas

- **`operationsVesselSchema`** - Vessel schema for cargo analysis operations
- **`portCallSchema`** - Port call validation for scheduling
- **`bunkerConsumptionSchema`** - Bunker consumption validation
- **`routingPointSchema`** - Routing point validation
- **`distanceResultSchema`** - Distance calculation result validation
- **`bunkerRateSchema`** - Bunker rate validation
- **`financeMetricsSchema`** - Financial metrics validation
- **`shipAnalysisSchema`** - Complete ship analysis validation

## Usage Examples

### Basic Validation

```typescript
import { vesselSchema, validateVessel } from '@commercialapp/ui';

// Validate a vessel object
const vessel = {
  name: "Test Vessel",
  code: "TV001",
  dwt: "50000",
  type: "Bulk Carrier",
  runningCost: "15000",
  imo: "1234567",
  vesselGrades: []
};

const result = vesselSchema.safeParse(vessel);
if (!result.success) {
  console.error('Validation errors:', result.error.issues);
} else {
  console.log('Vessel is valid:', result.data);
}

// Or use the helper function
const validation = validateVessel(vessel);
if (!validation.success) {
  console.error('Validation failed:', validation.error.issues);
}
```

### Form Validation

```typescript
import { createShipRequestSchema } from '@commercialapp/ui';

const handleSubmit = async (formData: any) => {
  const validation = createShipRequestSchema.safeParse(formData);
  
  if (!validation.success) {
    // Handle validation errors
    const errors = validation.error.issues.map(issue => 
      `${issue.path.join('.')}: ${issue.message}`
    );
    setFormErrors(errors);
    return;
  }
  
  // Proceed with valid data
  const validData = validation.data;
  await submitShip(validData);
};
```

### Real-time Field Validation

```typescript
import { validateAndNotifyPortCallChange } from '@commercialapp/ui';

const handleFieldChange = (portCall: any, field: string, value: any) => {
  if (validateAndNotifyPortCallChange(portCall, field, value)) {
    // Validation passed, update the field
    updatePortCall(portCall.id, field, value);
  }
  // Validation failed, error notification already shown
};
```

## Validation Rules

### Vessel Validation
- **name**: Required, max 100 characters
- **code**: Required, max 20 characters
- **dwt**: Required string
- **type**: Required string
- **runningCost**: Required string
- **imo**: Required, exactly 7 digits
- **vesselGrades**: Array of valid grade objects

### Port Call Validation
- **id**: Required positive number
- **portName**: Required non-empty string
- **activity**: Must be one of: 'Ballast', 'Load', 'Discharge', 'Bunker', 'Owners Affairs', 'Transit', 'Canal'
- **portDays**: Non-negative number
- **additionalCosts**: Non-negative number
- **distance**: Non-negative number
- **speedSetting**: Optional, must be 'Eco' or 'Performance'

### Bunker Rate Validation
- **grade**: Required string
- **price**: Non-negative number
- **ballastPerDayConsumption**: Non-negative number
- **ladenPerDayConsumption**: Non-negative number
- **portConsumption**: Non-negative number

## Error Handling

All schemas provide detailed error messages that can be displayed to users:

```typescript
const validation = vesselSchema.safeParse(data);
if (!validation.success) {
  validation.error.issues.forEach(issue => {
    console.log(`Field: ${issue.path.join('.')}`);
    console.log(`Error: ${issue.message}`);
    console.log(`Code: ${issue.code}`);
  });
}
```

## Integration with UI Components

The validation schemas are designed to work seamlessly with the existing UI components:

- **Form validation**: Use with form libraries like React Hook Form
- **Real-time validation**: Validate fields as users type
- **Batch validation**: Validate entire objects or arrays
- **Error display**: Show validation errors in user-friendly notifications

## Performance Considerations

- Validation is fast and lightweight
- Use `safeParse()` for better performance when errors are expected
- Cache validation results when possible
- Validate only changed fields for real-time validation

## Testing

All schemas include comprehensive validation rules and can be tested with various data scenarios:

```typescript
// Test valid data
expect(vesselSchema.safeParse(validVessel).success).toBe(true);

// Test invalid data
const result = vesselSchema.safeParse(invalidVessel);
expect(result.success).toBe(false);
expect(result.error.issues).toHaveLength(1);
expect(result.error.issues[0].message).toContain('required');
```
