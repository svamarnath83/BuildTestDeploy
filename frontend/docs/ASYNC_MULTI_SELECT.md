# AsyncMultiSelect Component

A reusable async multi-select dropdown component built with `react-select-async-paginate` that provides client-side pagination, search debouncing, and result caching.

## Features

- **Client-side pagination**: Shows only 50 items at a time by default
- **Search debouncing**: 300ms debounce timeout to prevent excessive API calls
- **Result caching**: Caches filtered results in memory to prevent reprocessing
- **Multi-select support**: Built-in support for selecting multiple items
- **Customizable styling**: Matches existing UI design patterns
- **TypeScript support**: Fully typed with TypeScript interfaces

## Usage

```tsx
import { AsyncMultiSelect, AsyncSelectOption } from '@commercialapp/ui';

// Example data
const ports = [
  { Code: 'USNYC', Name: 'New York' },
  { Code: 'USLAX', Name: 'Los Angeles' },
  { Code: 'GBLON', Name: 'London' },
  // ... more ports
];

// Map function to transform data to options
const mapPortToOption = (port: any): AsyncSelectOption => ({
  value: port.Code,
  label: `${port.Name} (${port.Code})`,
  displayValue: port.Name
});

// Component usage
function MyComponent() {
  const [selectedPorts, setSelectedPorts] = useState<AsyncSelectOption[]>([]);

  return (
    <AsyncMultiSelect
      label="Select Ports"
      placeholder="Choose ports..."
      value={selectedPorts}
      onChange={setSelectedPorts}
      data={ports}
      mapToOption={mapPortToOption}
      pageSize={50}
      debounceTimeout={300}
      showCodeOnly={true}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label displayed above the select |
| `placeholder` | `string` | `"Select..."` | Placeholder text |
| `value` | `AsyncSelectOption[]` | - | Selected values |
| `onChange` | `(value: AsyncSelectOption[]) => void` | - | Change handler |
| `className` | `string` | - | Additional CSS classes |
| `data` | `any[]` | - | Source data array |
| `mapToOption` | `(item: any) => AsyncSelectOption` | - | Function to map data to options |
| `pageSize` | `number` | `50` | Number of items per page |
| `debounceTimeout` | `number` | `300` | Search debounce timeout in ms |
| `isDisabled` | `boolean` | `false` | Whether the select is disabled |
| `isClearable` | `boolean` | `true` | Whether to show clear button |
| `showCodeOnly` | `boolean` | `false` | Show only displayValue in selected chips |

## AsyncSelectOption Interface

```tsx
interface AsyncSelectOption {
  value: string | number;
  label: string;
  displayValue?: string;
}
```

- `value`: The actual value of the option
- `label`: Text displayed in the dropdown
- `displayValue`: Optional text displayed in selected chips (when `showCodeOnly` is true)

## Performance Features

1. **Client-side pagination**: Only renders visible items, improving performance with large datasets
2. **Search debouncing**: Prevents excessive filtering operations during typing
3. **Result caching**: Caches filtered results to avoid reprocessing the same search
4. **Memory efficient**: Clears cache when data changes to prevent memory leaks

## Styling

The component uses the same styling as the existing `MultiSelect` component to maintain UI consistency. It includes:

- Borderless design with bottom border
- Hover and focus states
- Custom multi-value chips
- Responsive design
- Consistent typography and spacing 