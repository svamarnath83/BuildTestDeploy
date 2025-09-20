# Port Call Management System

## Overview

This document outlines the comprehensive port call management system for the Voyage Manager application. The system handles dynamic recalculation of voyage schedules based on changes to port call parameters, ensuring data consistency and accurate voyage planning.

## Core Fields

The port call system manages the following key fields:

- **Arrival Date**: When the vessel arrives at the port
- **Departure Date**: When the vessel departs from the port  
- **Speed**: Vessel speed in knots
- **Distance**: Distance to next port in nautical miles
- **Port Days**: Number of days spent at the port
- **Sequence Order**: Order of ports in the voyage

## Field Change Logic

### 1. Speed Change

**Trigger**: When the `speed` field is modified

**Actions**:
1. Recalculate steam days for the current port call
   - Formula: `steamDays = distance / speed`
2. Add steam days to the next port's arrival date
   - `nextPortArrival = currentPortDeparture + steamDays`
3. Adjust all subsequent ports' arrival and departure dates accordingly
4. Maintain port days for all ports (only arrival/departure dates shift)

**Implementation Notes**:
- Steam days calculation should handle division by zero (speed = 0)
- Date calculations must account for time zones and daylight saving
- Update sequence order if needed

### 2. Port Days Change

**Trigger**: When the `portDays` field is modified

**Actions**:
1. Recalculate departure date for the current port
   - `departureDate = arrivalDate + portDays`
2. Adjust all subsequent ports' arrival and departure dates
   - Shift all dates by the difference in port days
3. Maintain speed and distance values for all ports

**Implementation Notes**:
- Port days should be positive values
- Handle edge cases where port days exceed reasonable limits
- Update voyage total duration calculations

### 3. Arrival Date Change

**Trigger**: When the `arrival` field is modified

**Actions**:
1. Recalculate speed for the current port call
   - Formula: `speed = distance / steamDays`
   - Where `steamDays = (arrival - previousPortDeparture)`
2. Adjust all subsequent ports' arrival and departure dates
   - Maintain relative timing between ports
3. Update voyage timeline calculations

**Implementation Notes**:
- Speed calculation requires previous port's departure date
- Handle cases where previous port data is missing
- Validate that arrival date is after previous port departure

### 4. Departure Date Change

**Trigger**: When the `departure` field is modified

**Actions**:
1. Recalculate port days for the current port
   - `portDays = departureDate - arrivalDate`
2. Adjust all subsequent ports' arrival and departure dates
   - Shift all dates by the difference in departure timing
3. Maintain speed and distance values

**Implementation Notes**:
- Departure date must be after arrival date
- Port days should be recalculated and updated in the UI
- Validate date consistency across the voyage

### 5. Distance Change

**Trigger**: When the `distance` field is modified

**Actions**:
1. Recalculate steam days for the current port call
   - `steamDays = distance / speed`
2. Update next port's arrival date
   - `nextPortArrival = currentPortDeparture + steamDays`
3. Adjust all subsequent ports' arrival and departure dates
4. Maintain port days for all ports

**Implementation Notes**:
- Distance should be positive values
- Speed must be available for calculation
- Handle cases where speed is zero or undefined

## Drag and Drop Functionality

### Sequence Update

**Trigger**: When a port call is dragged to a new position

**Actions**:
1. Update `sequenceOrder` for all affected ports
2. Recalculate all dates based on new sequence
3. Maintain data integrity across the voyage

**Implementation Notes**:
- Use the existing `@dnd-kit` library implementation
- Update sequence order immediately after drop
- Recalculate all dependent fields

### Drag Drop Restrictions

**Ballast Ports**:
- Ballast ports cannot be moved via drag and drop
- Disable drag handle for ports with activity = "Ballast"
- Show visual indicator (disabled state) for ballast ports

**Boundary Constraints**:
- Other ports cannot be moved beyond ballast ports
- Maintain logical voyage flow (load → discharge → ballast)
- Validate port sequence maintains business logic

### Recalculation After Drag Drop

**Actions**:
1. Recalculate steam days for all affected port pairs
2. Update arrival/departure dates based on new sequence
3. Maintain port days and speed values where possible
4. Validate data consistency across the entire voyage

## Add Port Functionality

### Add Port Call

**Trigger**: When "Add Port" button is clicked

**Actions**:
1. Create new port call with default values
2. Insert at the end of the current sequence
3. Update sequence order for all ports
4. Recalculate dates based on previous port's data
5. Open port selection dialog

**Default Values**:
```typescript
{
  id: generateUniqueId(),
  voyageId: currentVoyageId,
  portId: 0,
  portName: '',
  sequenceOrder: nextSequenceNumber,
  activity: 'Load',
  arrival: calculateNextArrival(),
  departure: calculateNextDeparture(),
  distance: 0,
  portDays: 1,
  speed: previousPortSpeed || 12,
  // ... other default fields
}
```

**Implementation Notes**:
- Generate unique temporary ID for new ports
- Calculate arrival date based on previous port's departure + steam days
- Set reasonable default values based on voyage context

## Delete Port Functionality

### Delete Port Call

**Trigger**: When delete button is clicked on a port call

**Actions**:
1. Remove port call from the sequence
2. Update sequence order for remaining ports
3. Recalculate dates for affected ports
4. Maintain data consistency

**Validation**:
- Prevent deletion of the last port call
- Confirm deletion with user (optional)
- Handle cascade effects on dependent data

**Implementation Notes**:
- Update sequence order after deletion
- Recalculate steam days and dates
- Clean up any related data (bunker consumption, costs, etc.)

## Data Validation Rules

### Field Validation

1. **Arrival Date**: Must be after previous port's departure date
2. **Departure Date**: Must be after arrival date
3. **Port Days**: Must be positive number
4. **Speed**: Must be positive number (0 < speed < 50 knots)
5. **Distance**: Must be positive number
6. **Sequence Order**: Must be unique and sequential

### Business Logic Validation

1. **Voyage Flow**: Load ports should come before discharge ports
2. **Ballast Positioning**: Ballast ports should be at the end
3. **Date Consistency**: All dates should be in chronological order
4. **Speed Reasonableness**: Speed should be within realistic vessel limits

## Error Handling

### Common Error Scenarios

1. **Division by Zero**: When speed is 0 during steam days calculation
2. **Invalid Dates**: When dates are in wrong chronological order
3. **Missing Data**: When required fields are empty
4. **Calculation Overflow**: When date calculations exceed reasonable limits

### Error Recovery

1. **Default Values**: Provide sensible defaults for missing data
2. **User Notifications**: Show clear error messages
3. **Data Rollback**: Allow users to undo problematic changes
4. **Validation Feedback**: Highlight invalid fields in real-time

## Performance Considerations

### Optimization Strategies

1. **Debounced Updates**: Delay recalculation until user stops typing
2. **Batch Updates**: Group multiple field changes into single recalculation
3. **Incremental Updates**: Only recalculate affected ports
4. **Caching**: Cache calculated values to avoid redundant computations

### Memory Management

1. **Cleanup**: Remove unused port call data when deleted
2. **Efficient Updates**: Use immutable update patterns
3. **State Management**: Minimize re-renders with proper state structure

## Implementation Architecture

### Component Structure

```
PortCallList
├── PortCallRow (for each port call)
│   ├── FieldInputs (arrival, departure, speed, etc.)
│   ├── DragHandle (disabled for ballast ports)
│   └── ActionButtons (delete, edit)
├── AddPortButton
└── DragDropContext
```

### State Management

```typescript
interface PortCallState {
  portCalls: VoyagePortCall[];
  isDirty: boolean;
  validationErrors: ValidationError[];
  recalculationInProgress: boolean;
}
```

### Service Layer

```typescript
class PortCallCalculationService {
  recalculateAfterSpeedChange(portCalls: VoyagePortCall[], changedIndex: number): VoyagePortCall[];
  recalculateAfterPortDaysChange(portCalls: VoyagePortCall[], changedIndex: number): VoyagePortCall[];
  recalculateAfterArrivalChange(portCalls: VoyagePortCall[], changedIndex: number): VoyagePortCall[];
  recalculateAfterDepartureChange(portCalls: VoyagePortCall[], changedIndex: number): VoyagePortCall[];
  recalculateAfterDistanceChange(portCalls: VoyagePortCall[], changedIndex: number): VoyagePortCall[];
  recalculateAfterSequenceChange(portCalls: VoyagePortCall[]): VoyagePortCall[];
  validatePortCallSequence(portCalls: VoyagePortCall[]): ValidationResult;
}
```

## Testing Requirements

### Unit Tests

1. **Calculation Logic**: Test all recalculation methods
2. **Validation Rules**: Test field and business logic validation
3. **Edge Cases**: Test division by zero, invalid dates, etc.
4. **Drag and Drop**: Test sequence updates and restrictions

### Integration Tests

1. **End-to-End Workflows**: Test complete port call management flows
2. **Data Persistence**: Test save/load functionality
3. **Performance**: Test with large numbers of port calls
4. **Error Scenarios**: Test error handling and recovery

## Future Enhancements

### Planned Features

1. **Bulk Operations**: Select and modify multiple port calls
2. **Template System**: Save and reuse common port call patterns
3. **Advanced Validation**: Weather-based speed adjustments
4. **Integration**: Connect with external port databases
5. **Analytics**: Voyage performance metrics and optimization suggestions

### Technical Improvements

1. **Real-time Collaboration**: Multiple users editing simultaneously
2. **Offline Support**: Work without internet connection
3. **Mobile Optimization**: Touch-friendly interface for tablets
4. **Accessibility**: Screen reader and keyboard navigation support
