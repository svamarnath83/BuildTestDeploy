# MultiSelect Component

A simple, dynamic multi-select component built with react-select and makeAnimated.

## Features

- ✅ Multi-select with animated chips/tags
- ✅ Client-side search and filtering
- ✅ Dynamic data mapping with custom keys
- ✅ Consistent styling with blue theme
- ✅ TypeScript support
- ✅ SSR compatible - no hydration errors
- ✅ Show code only in selected chips (for ports)
- ✅ Simple and clean - no validation messages

## Basic Usage

```tsx
import { MultiSelect, SelectOption } from '@commercialapp/ui';

function MyComponent() {
  const [selectedItems, setSelectedItems] = useState<SelectOption[]>([]);
  
  const data = [
    { id: 1, name: 'Option 1' },
    { id: 2, name: 'Option 2' },
    { id: 3, name: 'Option 3' }
  ];

  return (
    <MultiSelect
      label="Select Items"
      placeholder="Choose items"
      value={selectedItems}
      onChange={setSelectedItems}
      data={data}
    />
  );
}
```

## Dynamic Usage Examples

### Port Selection with Code Display
```tsx
const portData = [
  { id: 1, Name: 'Rotterdam', PortCode: 'NLRTM' },
  { id: 2, Name: 'Singapore', PortCode: 'SGSIN' }
];

<MultiSelect
  label="Ports"
  placeholder="Select ports"
  value={selectedPorts}
  onChange={setSelectedPorts}
  data={portData}
  showCodeOnly={true}
  valueKey="Name"
  labelKey="Name"
  codeKey="PortCode"
/>
```

### Custom Data Keys
```tsx
const shipData = [
  { shipId: 1, shipName: 'Ship A', imo: 'IMO1234567' },
  { shipId: 2, shipName: 'Ship B', imo: 'IMO7654321' }
];

<MultiSelect
  label="Ships"
  placeholder="Select ships"
  value={selectedShips}
  onChange={setSelectedShips}
  data={shipData}
  valueKey="shipId"
  labelKey="shipName"
/>
```

### Single Select
```tsx
<MultiSelect
  label="Country"
  placeholder="Select country"
  value={selectedCountry}
  onChange={setSelectedCountry}
  data={countries}
  isMulti={false}
/>
```

### Different Sizes
```tsx
// Small
<MultiSelect
  label="Small Select"
  placeholder="Choose option"
  value={selectedOption}
  onChange={setSelectedOption}
  data={options}
  size="sm"
/>

// Large
<MultiSelect
  label="Large Select"
  placeholder="Choose option"
  value={selectedOption}
  onChange={setSelectedOption}
  data={options}
  size="lg"
/>
```

### Disable Search or Clear
```tsx
<MultiSelect
  label="Categories"
  placeholder="Select categories"
  value={selectedCategories}
  onChange={setSelectedCategories}
  data={categories}
  isSearchable={false}
  isClearable={false}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label displayed above the select (optional) |
| `placeholder` | `string` | - | Placeholder text in the select |
| `value` | `SelectOption[]` | - | Currently selected options |
| `onChange` | `(value: SelectOption[]) => void` | - | Callback when selection changes |
| `className` | `string` | - | Additional CSS classes |
| `data` | `any[]` | - | Array of data items to display |
| `transformData` | `(data: any[]) => SelectOption[]` | - | Custom data transformation function |
| `isMulti` | `boolean` | `true` | Whether to allow multiple selections |
| `isSearchable` | `boolean` | `true` | Whether to allow searching/filtering |
| `isClearable` | `boolean` | `true` | Whether to show clear button |
| `showCodeOnly` | `boolean` | `false` | Show only port code in selected chips |
| `instanceId` | `string` | - | Stable ID for SSR compatibility |
| `valueKey` | `string` | - | Custom key for value field |
| `labelKey` | `string` | - | Custom key for label field |
| `codeKey` | `string` | `'PortCode'` | Custom key for code field (when showCodeOnly is true) |
| `disabled` | `boolean` | `false` | Disable the select |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variants |

## SelectOption Interface

```tsx
interface SelectOption {
  value: string;
  label: string;
  displayValue?: string;
}
```

## Data Format

The component accepts any array of objects. By default, it looks for these properties in order:

**For value:**
1. `valueKey` (if provided)
2. `value`
3. `id`
4. `name`
5. `Name`
6. `label`
7. `Label`

**For label:**
1. `labelKey` (if provided)
2. `label`
3. `Label`
4. `name`
5. `Name`
6. `value`
7. `id`

**For showCodeOnly (when enabled):**
- Uses `codeKey` field (defaults to `PortCode`)

## Examples

### Simple Array
```tsx
const simpleData = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Orange' }
];

<MultiSelect
  label="Fruits"
  placeholder="Select fruits"
  value={selectedFruits}
  onChange={setSelectedFruits}
  data={simpleData}
/>
```

### Port Selection
```tsx
const portData = [
  { id: 1, Name: 'Rotterdam', PortCode: 'NLRTM' },
  { id: 2, Name: 'Singapore', PortCode: 'SGSIN' }
];

<MultiSelect
  label="Ports"
  placeholder="Select ports"
  value={selectedPorts}
  onChange={setSelectedPorts}
  data={portData}
  showCodeOnly={true}
  valueKey="Name"
  labelKey="Name"
  codeKey="PortCode"
/>
```

### Custom Transformation
```tsx
const shipData = [
  { id: 1, name: 'Ship A', imo: 'IMO1234567', dwt: 50000 },
  { id: 2, name: 'Ship B', imo: 'IMO7654321', dwt: 75000 }
];

<MultiSelect
  label="Ships"
  placeholder="Select ships"
  value={selectedShips}
  onChange={setSelectedShips}
  data={shipData}
  transformData={(data) => 
    data.map(ship => ({
      value: ship.id.toString(),
      label: `${ship.name} (${ship.imo}) - ${ship.dwt} DWT`
    }))
  }
/>
```

### Cargo Details Example
```tsx
// Load Ports
<MultiSelect
  label="Load Ports"
  placeholder="Select load ports"
  value={cargoInput.loadPorts.map(port => ({ value: port, label: port }))}
  onChange={handleLoadPortsChange}
  data={ports}
  showCodeOnly={true}
  valueKey="Name"
  labelKey="Name"
  codeKey="PortCode"
/>

// Discharge Ports
<MultiSelect
  label="Discharge Ports"
  placeholder="Select discharge ports"
  value={cargoInput.dischargePorts.map(port => ({ value: port, label: port }))}
  onChange={handleDischargePortsChange}
  data={ports}
  showCodeOnly={true}
  valueKey="Name"
  labelKey="Name"
  codeKey="PortCode"
/>
```

## SSR Compatibility

This component is fully compatible with Server-Side Rendering (SSR) and will not cause hydration errors. It automatically generates stable `instanceId` values to prevent ID conflicts between server and client rendering.

## Styling

The component uses a consistent blue theme:

- Control border: `#2563eb` (blue-600)
- Hover border: `#1d4ed8` (blue-700)
- Multi-value background: `#dbeafe` (blue-100)
- Multi-value text: `#1e40af` (blue-800)
- Option hover: `#bfdbfe` (blue-200)

### Size Variants
- `sm`: 32px height
- `md`: 40px height (default)
- `lg`: 48px height 