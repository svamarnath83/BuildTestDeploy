# Model Migration Guide

This document outlines the new model structure for the Accounting module and provides guidance on migrating from the legacy models.

## New Model Structure

The models have been reorganized into the following categories:

### 📁 `/models/entities.ts` - EF Core Entity Models
- Database entity models with navigation properties
- Used for Entity Framework Core mapping
- Contains relationships and constraints

### 📁 `/models/dtos.ts` - Data Transfer Objects
- Models for Web API communication
- Clean data structures without EF Core dependencies
- Optimized for JSON serialization

### 📁 `/models/requests.ts` - API Request/Response Models
- Request and response models for API endpoints
- Pagination, filtering, and search models
- Validation and error handling models

### 📁 `/models/viewModels.ts` - Frontend View Models
- UI-specific models and form models
- State management models
- Configuration and dashboard models

### 📁 `/models/apiClient.ts` - API Client Models
- HTTP client configuration
- Service interfaces
- Performance and monitoring models

## Migration Examples

### Legacy Model Usage:
```typescript
import { InvoiceForm, InvoiceLine, CustomerInfo } from '@/../../packages/ui/libs/accounting';

// Old way - mixed concerns
const invoice: InvoiceForm = {
  // Contains both UI state and data structure
};
```

### New Model Usage:

#### For UI Components:
```typescript
import { InvoiceFormModel, InvoiceFormState } from '@/../../packages/ui/libs/accounting/models/viewModels';

const invoiceForm: InvoiceFormModel = {
  // Clean UI model
};

const formState: InvoiceFormState = {
  form: invoiceForm,
  isLoading: false,
  errors: {},
  // Other UI state
};
```

#### For API Calls:
```typescript
import { CreateInvoiceRequest, InvoiceDto } from '@/../../packages/ui/libs/accounting/models';

const createRequest: CreateInvoiceRequest = {
  customerId: '...',
  lines: [...],
  // Clean API request
};

const invoiceDto: InvoiceDto = {
  // Clean data transfer object
};
```

#### For Database Operations:
```typescript
import { InvoiceEntity, InvoiceLineEntity } from '@/../../packages/ui/libs/accounting/models/entities';

const invoice: InvoiceEntity = {
  id: '...',
  customer: customerEntity,
  invoiceLines: [lineEntity1, lineEntity2],
  // Full entity with relationships
};
```

## Benefits of New Structure

### 🎯 **Separation of Concerns**
- **UI Models**: Handle form state, validation, and presentation
- **API Models**: Handle data transfer and communication
- **Entity Models**: Handle database structure and relationships

### 🔧 **Type Safety**
- Strongly typed interfaces for each layer
- Clear contracts between frontend and backend
- Reduced runtime errors

### 🚀 **Maintainability**
- Changes to UI don't affect API models
- Changes to database don't affect frontend
- Clear model ownership and responsibilities

### 📈 **Scalability**
- Easy to add new features without affecting existing code
- Clear patterns for new developers to follow
- Reusable models across different parts of the application

## Backward Compatibility

The legacy models are still available for backward compatibility:

```typescript
import { InvoiceForm, InvoiceLine } from '@/../../packages/ui/libs/accounting';
// Legacy models still work
```

However, we recommend migrating to the new model structure for new development.

## Component Updates

### Before (Legacy):
```typescript
import { InvoiceForm, InvoiceLine } from '@/../../packages/ui/libs/accounting';

interface Props {
  invoice: InvoiceForm;
  lines: InvoiceLine[];
}
```

### After (New Structure):
```typescript
import { InvoiceFormModel, InvoiceLineFormModel } from '@/../../packages/ui/libs/accounting/models/viewModels';

interface Props {
  invoice: InvoiceFormModel;
  lines: InvoiceLineFormModel[];
}
```

## API Service Updates

### Before (Legacy):
```typescript
const saveInvoice = async (invoice: InvoiceForm) => {
  // Mixed model used for both UI and API
};
```

### After (New Structure):
```typescript
import { CreateInvoiceRequest, CreateInvoiceResponse } from '@/../../packages/ui/libs/accounting/models/requests';

const saveInvoice = async (request: CreateInvoiceRequest): Promise<CreateInvoiceResponse> => {
  // Clean separation of concerns
};
```

## Best Practices

1. **Use the appropriate model for each layer**:
   - UI components → ViewModels
   - API calls → DTOs and Request/Response models
   - Database operations → Entity models

2. **Implement model mapping functions**:
   ```typescript
   const mapFormToRequest = (form: InvoiceFormModel): CreateInvoiceRequest => {
     // Map UI model to API model
   };
   ```

3. **Use type guards for runtime validation**:
   ```typescript
   if (isInvoiceDto(data)) {
     // TypeScript knows data is InvoiceDto
   }
   ```

4. **Leverage the model factory for creating new instances**:
   ```typescript
   const emptyInvoice = modelFactory.createEmptyInvoice();
   ```

## Questions?

If you have questions about the new model structure or need help migrating existing code, please reach out to the development team.
