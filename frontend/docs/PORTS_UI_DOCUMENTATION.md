# Ports UI Configuration and API Handling Documentation

## Overview
This document provides a comprehensive guide to the Ports module UI configuration and API handling in the Shipnet 2.0 application. The ports functionality is implemented across multiple layers including UI components, API services, data models, and validation schemas.

## Table of Contents
1. [Data Models](#data-models)
2. [API Configuration](#api-configuration)
3. [API Services](#api-services)
4. [UI Components](#ui-components)
5. [Form Validation](#form-validation)
6. [State Management](#state-management)
7. [Error Handling](#error-handling)
8. [File Structure](#file-structure)

## Data Models

### Port Interface
```typescript
export interface Port {
  /** Unique identifier for the port */
  Id: number;

  /** Port code (e.g., USNYC for New York) */
  PortCode: string;

  /** Full name of the port */
  Name: string;

  /** Latitude coordinate of the port */
  Latitude?: number | null;

  /** Longitude coordinate of the port */
  Longitude?: number | null;

  /** Indicates if the port is currently active */
  IsActive: boolean;
}
```

### Default Port Values
```typescript
export const defaultPort: Port = {
  Id: 0,
  Name: '',
  PortCode: '',
  Latitude: 0,
  Longitude: 0,
  IsActive: true,
};
```

### Additional Interfaces
```typescript
export interface CreatePortRequest {
  name: string;
  code: string;
  country: string;
  latitude: number;
  longitude: number;
  timeZone: string;
  status: string;
}

export interface UpdatePortRequest extends Partial<CreatePortRequest> {
  id: number;
}

export interface PortFilters {
  searchTerm?: string;
  country?: string;
  status?: string;
}

export interface PortListResponse {
  ports: Port[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

## API Configuration

### Base Configuration
```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:7071',
  ENDPOINTS: {
    PORTS: '/api/ports',
    // ... other endpoints
  },
  TIMEOUT: 10000, // 10 seconds
} as const;
```

### API URL Generation
```typescript
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
```

## API Services

### Port API Client
```typescript
import { createApiClient } from '../../api-client';
import { getApiUrl, API_CONFIG } from '../../../config/api';
import { Port } from './models';

const portApi = createApiClient(getApiUrl(API_CONFIG.ENDPOINTS.PORTS));
```

### Available API Methods
```typescript
// Get all ports
export const getPort = () => portApi.get('/GetPorts');

// Add or update port
export const addPort = (data: Port) => portApi.post('/AddOrUpdatePort', data);

// Delete port by ID
export const deletePort = (id: number) => portApi.delete(`/DeletePort/${id}`);

// Get port by ID
export const getPortById = (id: number) => portApi.get(`/GetPortById/${id}`);
```

### API Endpoints
- `GET /api/ports/GetPorts` - Retrieve all ports
- `POST /api/ports/AddOrUpdatePort` - Create or update a port
- `DELETE /api/ports/DeletePort/{id}` - Delete a port by ID
- `GET /api/ports/GetPortById/{id}` - Get a specific port by ID

## UI Components

### PortExplorer Component
**Location**: `apps/registers/app/ports/components/PortExplorer.tsx`

**Features**:
- Displays ports in a data table format
- Supports CRUD operations (Create, Read, Update, Delete)
- Handles loading states
- Manages form visibility
- Implements delete confirmation dialog

**Key State Management**:
```typescript
const [PortsData, setPorts] = useState<Port[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [showForm, setShowForm] = useState(false);
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [portToDelete, setPortToDelete] = useState<Port | null>(null);
const [editingPort, setEditingPort] = useState<Port | null>(null);
```

**Table Columns Configuration**:
```typescript
const portColumnsMeta: ColumnMeta<Port>[] = [
  { key: 'Id', title: 'ID', isNumeric: true, isOptional: true },
  { key: 'Name', title: 'Port Name', isOptional: false },
  { key: 'PortCode', title: 'UN/LOCODE', isOptional: false },
  { key: 'Latitude', title: 'Latitude', isOptional: false },
  { key: 'Longitude', title: 'Longitude', isOptional: false },
];
```

### PortForm Component
**Location**: `apps/registers/app/ports/AddPort/components/portform.tsx`

**Features**:
- Handles both add and edit modes
- Real-time field validation
- Type-safe form handling
- Supports initial data population
- Implements form submission with validation

**Props Interface**:
```typescript
interface PortFormProps {
  initialData?: Partial<Port>;
  onSubmit: (data: Port) => void;
  onCancel: () => void;
  mode?: 'add' | 'edit';
}
```

**Form State Management**:
```typescript
const [form, setForm] = useState<Port>({ ...defaultPort, ...initialData });
const [errors, setErrors] = useState<{ [key: string]: string }>({});
```

### Supporting Components

#### PortInfo Component
**Location**: `apps/registers/app/ports/AddPort/components/PortInfo.tsx`
- Displays basic port information
- Handles port name and code input fields

#### BerthInfo Component
**Location**: `apps/registers/app/ports/AddPort/components/BerthInfo.tsx`
- Manages berth-related information
- Handles latitude and longitude coordinates

## Form Validation

### Validation Schema
```typescript
import { z } from 'zod';

export const portFormSchema = z.object({
  Name: z.string().min(1, 'Required'),
  PortCode: z.string().min(1, 'Required'),
});
```

### Field Type Mapping
```typescript
const fieldTypes: Record<keyof Port, 'string' | 'number' | 'boolean'> = {
  Id: 'number',
  PortCode: 'string',
  Name: 'string',
  Latitude: 'number',
  Longitude: 'number',
  IsActive: 'boolean'
};
```

### Validation Features
- **Real-time validation**: Fields are validated as user types
- **Type conversion**: Automatic conversion between string inputs and expected data types
- **Error display**: Validation errors are displayed inline
- **Form submission**: Complete form validation before submission

## State Management

### Component State Patterns
1. **Data State**: Manages the list of ports and current port data
2. **UI State**: Controls form visibility, loading states, and dialogs
3. **Form State**: Handles form data and validation errors
4. **Operation State**: Tracks edit/delete operations

### State Flow
```
Load Ports → Display Table → User Action → Update State → Re-render
     ↓
Edit/Add Port → Show Form → Validate → Submit → Update List
     ↓
Delete Port → Show Dialog → Confirm → Remove from List
```

## Error Handling

### Notification System
```typescript
import { 
  showSuccessNotification, 
  showErrorNotification,
  showCreatedNotification,
  showUpdatedNotification,
  showDeletedNotification 
} from '@commercialapp/ui/src/components/ui/react-hot-toast-notifications'
```

### Error Handling Patterns
1. **API Errors**: Caught in try-catch blocks with user-friendly messages
2. **Validation Errors**: Displayed inline with form fields
3. **Network Errors**: Handled with timeout and retry mechanisms
4. **User Feedback**: Toast notifications for all operations

### Error Recovery
- **Form Validation**: Clear validation errors on successful submission
- **API Failures**: Maintain form state for retry
- **Network Issues**: Automatic retry with exponential backoff

## File Structure

```
packages/ui/libs/registers/ports/
├── models.ts              # Port interface and related types
├── services.ts            # API service functions
├── defaultPort.ts         # Default port values
└── portFormSchema.ts      # Zod validation schema

apps/registers/app/ports/
├── components/
│   └── PortExplorer.tsx   # Main ports table component
├── AddPort/
│   ├── components/
│   │   ├── portform.tsx   # Main form component
│   │   ├── PortInfo.tsx   # Port information section
│   │   └── BerthInfo.tsx  # Berth information section
│   └── page.tsx           # Add port page
└── page.tsx               # Main ports page

apps/registers/app/api/ports/
└── route.ts               # API route handlers
```

## Usage Examples

### Creating a New Port
```typescript
// In PortExplorer component
const handleAddPort = () => {
  setEditingPort(null);
  setShowForm(true);
};
```

### Editing an Existing Port
```typescript
const handleEditPort = async (port: Port) => {
  if (port.Id) {
    const portData = await getPortById(port.Id);
    const sanitized = { ...portData.data };
    // Sanitize nulls to empty string for string fields
    for (const key in sanitized) {
      if (sanitized[key] === null && typeof sanitized[key] !== 'number' && typeof sanitized[key] !== 'boolean') {
        sanitized[key] = '';
      }
    }
    setEditingPort(sanitized);
  }
  setShowForm(true);
};
```

### Deleting a Port
```typescript
const confirmDeletePort = async () => {
  if (!portToDelete || !portToDelete.Id) return;
  try {
    await deletePort(portToDelete.Id);
    setPorts(prev => prev.filter(p => p.Id !== portToDelete.Id));
    showDeletedNotification("Port");
  } catch (error) {
    showErrorNotification({ description: "Failed to delete port" });
  } finally {
    setDeleteDialogOpen(false);
    setPortToDelete(null);
  }
};
```

## Best Practices

1. **Type Safety**: Always use TypeScript interfaces for data structures
2. **Validation**: Implement both client-side and server-side validation
3. **Error Handling**: Provide meaningful error messages to users
4. **State Management**: Keep component state minimal and focused
5. **API Abstraction**: Use service layers to abstract API calls
6. **User Feedback**: Provide immediate feedback for all user actions
7. **Loading States**: Show loading indicators for async operations
8. **Form Handling**: Implement proper form validation and error display

## Configuration Notes

- **API Base URL**: Configured in `packages/ui/config/api.ts`
- **Timeout**: Set to 10 seconds for API requests
- **Validation**: Uses Zod for schema validation
- **Styling**: Uses Tailwind CSS with custom components
- **Icons**: Uses Lucide React icons
- **Notifications**: Uses react-hot-toast for user feedback

This documentation provides a complete overview of the ports UI configuration and API handling, making it easier to understand, maintain, and extend the ports functionality. 