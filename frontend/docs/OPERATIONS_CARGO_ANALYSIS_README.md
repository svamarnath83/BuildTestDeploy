# Cargo Analysis Validation Schemas

This directory contains Zod validation schemas and utilities specifically for the cargo analysis operations app.

## Overview

The validation system ensures data integrity across all ship-related operations including:
- Port rotation scheduling
- Vessel data validation
- Port call management
- Bunker consumption tracking
- Financial calculations

## Available Schemas

### Core Validation Schemas

- **`cargoInputSchema`** - Cargo input validation with laycan date validation
- **`vesselSchema`** - Operations-specific vessel validation
- **`portCallSchema`** - Port call validation for scheduling
- **`bunkerConsumptionSchema`** - Bunker consumption validation
- **`routingPointSchema`** - Routing point validation
- **`distanceResultSchema`** - Distance calculation result validation
- **`bunkerRateSchema`** - Bunker rate validation
- **`financeMetricsSchema`** - Financial metrics validation
- **`shipAnalysisSchema`** - Complete ship analysis validation
- **`estimateCalculationParamsSchema`** - Estimate calculation parameters validation
- **`portRotationScheduleSchema`** - Port rotation schedule validation

### Validation Utilities

- **`validatePortCall`** - Basic port call validation
- **`validateVessel`** - Basic vessel validation
- **`validateCargoInput`** - Basic cargo input validation
- **`validateShipAnalysis`** - Basic ship analysis validation
- **`validatePortRotationSchedule`** - Basic schedule validation

## Advanced Validation Utilities

### `validationUtils.ts`

Provides comprehensive validation functions with detailed error reporting:

- **`validatePortCallWithDetails`** - Returns detailed validation results
- **`validateVesselWithDetails`** - Returns detailed vessel validation results
- **`validateCargoInputWithDetails`** - Returns detailed cargo validation results
- **`validateShipAnalysisWithDetails`** - Returns detailed ship analysis validation results
- **`validatePortRotationScheduleWithDetails`** - Returns detailed schedule validation results
- **`validateScheduleComprehensive`** - Comprehensive schedule validation with warnings
- **`showValidationNotifications`** - Shows validation results as notifications
- **`validateAndNotifyPortCallChange`** - Validates and shows notifications for port call changes
- **`validateAndNotifyVesselChange`** - Validates and shows notifications for vessel changes
- **`batchValidate`** - Batch validation for multiple entities

## Usage Examples

### Basic Field Validation

```typescript
import { validateAndNotifyPortCallChange } from '../libs';

const handleFieldChange = (portCall: any, field: string, value: any) => {
  if (validateAndNotifyPortCallChange(portCall, field, value)) {
    // Validation passed, update the field
    onScheduleChange(index, field, value);
  }
  // Validation failed, error notification already shown
};
```

### Comprehensive Schedule Validation

```typescript
import { validateScheduleComprehensive, showValidationNotifications } from '../libs';

const validateSchedule = (schedule: any[]) => {
  const validationResult = validateScheduleComprehensive(schedule);
  showValidationNotifications(validationResult, 'Port Rotation Schedule');
  
  if (!validationResult.isValid) {
    console.error('Validation errors:', validationResult.errors);
    return false;
  }
  
  if (validationResult.warnings.length > 0) {
    console.warn('Validation warnings:', validationResult.warnings);
  }
  
  return true;
};
```

### Real-time Validation in Components

```typescript
import { validateAndNotifyPortCallChange } from '../libs';

// In a form field onChange handler
<Input
  value={call.portDays}
  onChange={(e) => {
    const portDays = parseFloat(e.target.value) || 0;
    if (validateAndNotifyPortCallChange(call, 'portDays', portDays)) {
      handleScheduleChange(index, 'portDays', e.target.value);
    }
  }}
/>
```

## Validation Rules

### Port Call Validation
- **id**: Required positive number
- **portName**: Required non-empty string
- **activity**: Must be valid activity type
- **portDays**: Non-negative number
- **additionalCosts**: Non-negative number
- **distance**: Non-negative number
- **speedSetting**: Optional, must be 'Eco' or 'Performance'

### Vessel Validation
- **id**: Required positive number
- **vesselName**: Required non-empty string
- **ballastPort**: Required non-empty string
- **ballastDate**: Required non-empty string
- **capacity**: Required positive number
- **ecoSpeed**: Required positive number
- **performanceSpeed**: Required positive number
- **dailyOpEx**: Non-negative number

### Cargo Input Validation
- **commodity**: Required non-empty string
- **quantity**: Required positive number
- **loadPorts**: Required array with at least one port
- **dischargePorts**: Required array with at least one port
- **laycanFrom**: Required date string
- **laycanTo**: Required date string (must be after laycanFrom)

## Error Handling

All validation functions provide detailed error messages and integrate with the notification system:

```typescript
// Validation errors are automatically shown as notifications
const validation = validateAndNotifyPortCallChange(portCall, 'distance', -100);
// If validation fails, error notification is shown automatically
// Returns false to prevent further processing
```

## Integration with Components

The validation system is integrated into the `estPortRotation.tsx` component:

- **Real-time validation**: Fields are validated as users type/change values
- **Component-level validation**: Vessel and schedule are validated on component mount
- **Action validation**: Distance calculation is blocked if validation fails
- **User feedback**: Clear error messages and warnings via notifications

## Performance Considerations

- Validation is lightweight and fast
- Only validates changed fields for real-time validation
- Comprehensive validation runs on component mount and before critical actions
- Validation results can be cached when appropriate

## Testing

The validation schemas can be tested with various data scenarios:

```typescript
import { portCallSchema } from '../libs';

// Test valid port call
const validPortCall = {
  id: 1,
  portName: "Rotterdam",
  activity: "Load",
  portDays: 2,
  additionalCosts: 1000,
  distance: 100,
  // ... other required fields
};

expect(portCallSchema.safeParse(validPortCall).success).toBe(true);

// Test invalid port call
const invalidPortCall = {
  id: -1, // Invalid: negative ID
  portName: "", // Invalid: empty port name
  // ... missing required fields
};

const result = portCallSchema.safeParse(invalidPortCall);
expect(result.success).toBe(false);
expect(result.error.issues.length).toBeGreaterThan(0);
```

## Best Practices

1. **Use validation utilities**: Prefer the utility functions over direct schema validation
2. **Real-time validation**: Validate fields as users interact with them
3. **Comprehensive validation**: Run full validation before critical operations
4. **User feedback**: Always show validation errors via notifications
5. **Performance**: Cache validation results when possible
6. **Testing**: Test validation with edge cases and invalid data
