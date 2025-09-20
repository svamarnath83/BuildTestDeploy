# Cursor AI Prompt for Next.js Projects

## Project Context
You are an expert Next.js developer working on a modern shipping/logistics application. The project uses:

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** components (imported from `@commercialapp/ui`)
- **React Hook Form** for form management
- **Zod** for schema validation
- **@dnd-kit** for drag-and-drop functionality
- **Monorepo structure** with shared UI components

## Code Style Guidelines

### Component Structure
```typescript
'use client';

import { useState, useEffect } from 'react';
import { ComponentName } from '@commercialapp/ui';

interface ComponentProps {
  // Define props with proper TypeScript types
  propName: string;
  optionalProp?: number;
}

export default function ComponentName({ propName, optionalProp }: ComponentProps) {
  // State management
  const [state, setState] = useState<Type>(initialValue);

  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // Event handlers
  const handleEvent = (event: EventType) => {
    // Handler logic
  };

  return (
    <div className="space-y-4">
      {/* JSX content */}
    </div>
  );
}
```

### Styling Guidelines
- Use Tailwind CSS classes for styling
- Follow responsive design patterns: `sm:`, `md:`, `lg:`, `xl:`
- Use semantic color classes: `text-gray-600`, `bg-blue-50`, `border-green-200`
- Maintain consistent spacing with `space-y-`, `gap-`, `p-`, `m-` utilities
- Use `rounded-lg`, `border`, `shadow-md` for modern UI elements

### Form Handling
```typescript
// Use controlled components with proper state management
const [formData, setFormData] = useState({
  field1: '',
  field2: 0,
});

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, type } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: type === 'number' ? parseFloat(value) || 0 : value
  }));
};
```

### TypeScript Best Practices
- Define interfaces for all data structures
- Use proper typing for event handlers
- Implement proper prop interfaces for components
- Use generic types where appropriate
- Avoid `any` type - use proper typing

### Component Composition
- Break down large components into smaller, reusable pieces
- Use proper prop drilling or context for state management
- Implement proper error boundaries
- Use React.memo for performance optimization when needed

### File Organization
```
components/
  ├── ComponentName/
  │   ├── ComponentName.tsx
  │   ├── ComponentName.test.tsx
  │   └── index.ts
  ├── ui/ (shadcn components)
  └── shared/ (reusable components)
```

## Common Patterns

### Data Fetching
```typescript
const [data, setData] = useState<DataType[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/endpoint');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
```

### Form Validation
```typescript
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be 18 or older'),
});

type FormData = z.infer<typeof formSchema>;
```

### Drag and Drop
```typescript
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  if (over && active.id !== over.id) {
    // Handle reordering logic
  }
};
```

## UI Component Usage

### Cards
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@commercialapp/ui';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

### Forms
```typescript
import { Input, Label, FormItem, Button } from '@commercialapp/ui';

<FormItem>
  <Label htmlFor="field">Label</Label>
  <Input
    id="field"
    name="field"
    value={value}
    onChange={handleChange}
    placeholder="Placeholder"
  />
</FormItem>
```

### Tables
```typescript
<table className="w-full text-xs">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-3 py-2 text-left font-medium text-gray-500">Header</th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {/* Table rows */}
  </tbody>
</table>
```

## Performance Considerations
- Use `useCallback` for expensive functions passed as props
- Use `useMemo` for expensive calculations
- Implement proper loading states
- Use pagination for large datasets
- Optimize images with Next.js Image component

## Error Handling
- Implement proper error boundaries
- Use try-catch blocks for async operations
- Provide meaningful error messages
- Implement fallback UI for error states

## Accessibility
- Use semantic HTML elements
- Implement proper ARIA labels
- Ensure keyboard navigation
- Maintain proper color contrast
- Use proper heading hierarchy

## Testing Guidelines
- Write unit tests for utility functions
- Test component rendering and interactions
- Mock external dependencies
- Test error scenarios
- Use React Testing Library for component tests

## Deployment Considerations
- Optimize bundle size
- Implement proper environment variables
- Use Next.js Image optimization
- Implement proper caching strategies
- Monitor performance metrics

## Common Tasks

### Creating a New Page
1. Create file in `app/` directory
2. Export default component
3. Add proper metadata
4. Implement loading and error states

### Adding API Routes
1. Create file in `app/api/` directory
2. Export GET/POST/PUT/DELETE handlers
3. Implement proper error handling
4. Add input validation

### Creating Reusable Components
1. Define proper TypeScript interfaces
2. Implement proper prop validation
3. Add JSDoc comments for complex logic
4. Consider component composition patterns

## Code Review Checklist
- [ ] TypeScript types are properly defined
- [ ] Components are properly structured
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Accessibility considerations are met
- [ ] Performance optimizations are applied
- [ ] Code is properly documented
- [ ] Tests are written for critical functionality

## When Asking for Help
- Provide context about the specific problem
- Include relevant code snippets
- Mention any error messages
- Describe expected vs actual behavior
- Include relevant file structure

This prompt should help you write high-quality, maintainable Next.js code that follows best practices and project conventions. 