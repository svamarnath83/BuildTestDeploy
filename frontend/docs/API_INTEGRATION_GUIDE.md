# Cargo Analysis API Integration Guide

## Overview
This guide explains how to use the API services for saving estimates and creating voyages in the Cargo Analysis module.

## API Services

### 1. addOrUpdateEstimate(estimateData: ApiModel)
Saves or updates an estimate using the `/api/estimates` endpoint.

```typescript
import { addOrUpdateEstimate, convertToApiModel } from '../libs';

// Convert UI data to API format
const apiModel = convertToApiModel(
  shipAnalysisResults,
  bestSuitableVessel,
  cargoInput
);

// Save to API
const savedEstimate = await addOrUpdateEstimate(apiModel);
console.log('Saved estimate ID:', savedEstimate.id);
```

### 2. createVoyageFromEstimate(estimateId: number, voyageData?)
Creates a voyage from a saved estimate.

```typescript
import { createVoyageFromEstimate } from '../libs';

const voyageResult = await createVoyageFromEstimate(estimateId, {
  notes: 'Created from cargo analysis'
});

if (voyageResult.success) {
  console.log('Voyage created:', voyageResult.voyageNo);
}
```

### 3. Other Available Services

- `getEstimateById(id)` - Retrieve estimate by ID
- `getEstimates(filters?)` - Get all estimates with optional filtering
- `deleteEstimate(id)` - Delete an estimate
- `updateEstimateStatus(id, status)` - Update estimate status

## API Configuration

The API configuration is centralized in `packages/ui/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:7071',
  ENDPOINTS: {
    ESTIMATES: '/api/estimates',
    // ... other endpoints
  }
};
```

## Data Flow

1. **UI Interaction**: User fills cargo form, analyzes ships, selects "Best" ship
2. **Data Validation**: `validateApiModelData()` ensures all required data is present
3. **Data Conversion**: `convertToApiModel()` converts UI data to API format
4. **API Call**: `addOrUpdateEstimate()` saves to backend
5. **Success Handling**: Show confirmation with estimate details

## Error Handling

All API services include comprehensive error handling:

```typescript
try {
  const result = await addOrUpdateEstimate(apiModel);
  // Handle success
} catch (error) {
  // Error types:
  // - Network errors (server unreachable)
  // - API errors (400, 500, etc.)
  // - Validation errors
  console.error('API Error:', error.message);
}
```

## Integration in Components

The `CargoAnalysisExplorer` component demonstrates full integration:

- Loading states during API calls
- Button disable/enable logic
- Error handling with user feedback
- Success notifications

## API Model Structure

The `ApiModel` type defines the data structure sent to the API:

```typescript
type ApiModel = {
  id: number;
  estimateNo: string;
  date: string;
  type: string;
  ship: string;
  commodity: string;
  loadPorts: string;
  dischargePorts: string;
  status: string;
  voyageNo: string;
  shipAnalysis: string; // JSON string with all analysis data
};
```

## Best Practices

1. **Always validate data** before API calls using `validateApiModelData()`
2. **Handle loading states** to prevent double-clicking
3. **Provide user feedback** for both success and error cases
4. **Use the centralized API client** from `packages/ui/libs/api-client.ts`
5. **Log important operations** for debugging and monitoring

## Testing

To test the API integration:

1. Ensure backend is running on `http://localhost:7071`
2. Complete a cargo analysis in the UI
3. Mark a ship as "Best"
4. Click "Save Estimate" to test estimate saving
5. Click "Create Voyage" to test voyage creation

## Troubleshooting

Common issues:

- **CORS errors**: Check backend CORS configuration
- **Network timeout**: Adjust timeout in `api-client.ts`
- **Validation errors**: Check that all required fields are populated
- **Missing best ship**: Ensure a ship is marked as "Best" before saving