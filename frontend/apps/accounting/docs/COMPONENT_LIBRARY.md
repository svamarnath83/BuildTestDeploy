# Accounting App Component Library

## Overview
This document catalogs all reusable UI components and patterns used in the Accounting App modules (AR, AP, JE).

## 🧱 Core Layout Components

### 1. PageContainer
**Purpose**: Main page wrapper with consistent background and dark mode support
```tsx
interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children }) => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
    {children}
  </div>
);
```

### 2. ResponsiveNavigation
**Purpose**: Top navigation bar with responsive button layout
```tsx
interface ResponsiveNavigationProps {
  backLabel: string;
  onBack: () => void;
  actions: Array<{
    label: string;
    onClick: () => void;
    variant: 'primary' | 'secondary';
    icon?: React.ReactNode;
  }>;
}

export const ResponsiveNavigation: React.FC<ResponsiveNavigationProps> = ({
  backLabel,
  onBack,
  actions
}) => (
  <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 shadow-sm">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">{backLabel}</span>
      </button>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-md transition-colors shadow-sm ${
              action.variant === 'primary' 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-slate-600 text-white hover:bg-slate-700'
            }`}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  </div>
);
```

### 3. ContentWrapper
**Purpose**: Main content area with responsive padding
```tsx
interface ContentWrapperProps {
  children: React.ReactNode;
}

export const ContentWrapper: React.FC<ContentWrapperProps> = ({ children }) => (
  <div className="p-2 sm:p-4 max-w-full mx-auto space-y-4">
    {children}
  </div>
);
```

## 📝 Form Components

### 1. ResponsiveFormGrid
**Purpose**: 4-column responsive grid that adapts to screen size
```tsx
interface ResponsiveFormGridProps {
  children: React.ReactNode;
}

export const ResponsiveFormGrid: React.FC<ResponsiveFormGridProps> = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {children}
  </div>
);
```

### 2. CompactFieldGroup
**Purpose**: Two fields in a single row for related data
```tsx
interface CompactFieldGroupProps {
  children: React.ReactNode;
}

export const CompactFieldGroup: React.FC<CompactFieldGroupProps> = ({ children }) => (
  <div className="grid grid-cols-2 gap-2">
    {children}
  </div>
);
```

### 3. FormField
**Purpose**: Standard form field with label and input
```tsx
interface FormFieldProps {
  label: string;
  type?: 'text' | 'number' | 'date' | 'select' | 'textarea';
  value: string | number;
  onChange: (value: string | number) => void;
  disabled?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  compact?: boolean;
  rows?: number;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  disabled = false,
  placeholder,
  options,
  compact = false,
  rows = 3
}) => {
  const inputClasses = compact
    ? "w-full px-1 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-xs"
    : "w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm";

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-600 block">{label}</label>
      {type === 'select' ? (
        <select
          className={inputClasses}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        >
          {options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          className={`${inputClasses} resize-none`}
          rows={rows}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          step={type === 'number' ? '0.01' : undefined}
          className={inputClasses}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
        />
      )}
    </div>
  );
};
```

### 4. JournalAmountField
**Purpose**: Amount field with +/- selector for Journal Entry
```tsx
interface JournalAmountFieldProps {
  label: string;
  amount: number;
  isDebit: boolean;
  onAmountChange: (amount: number) => void;
  onSignChange: (isDebit: boolean) => void;
  disabled?: boolean;
}

export const JournalAmountField: React.FC<JournalAmountFieldProps> = ({
  label,
  amount,
  isDebit,
  onAmountChange,
  onSignChange,
  disabled = false
}) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-gray-600 block">{label}</label>
    <div className="flex items-center gap-1">
      <select 
        className="w-12 px-1 py-1 text-xs text-center border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        value={isDebit ? '+' : '-'}
        disabled={disabled}
        onChange={(e) => onSignChange(e.target.value === '+')}
      >
        <option value="+">+</option>
        <option value="-">-</option>
      </select>
      <input
        type="number"
        step="0.01"
        className="flex-1 px-2 py-1 text-xs text-right border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        value={amount || ''}
        disabled={disabled}
        onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
      />
    </div>
  </div>
);
```

## 🃏 Card Components

### 1. ResponsiveCard
**Purpose**: Card with responsive header layout
```tsx
interface ResponsiveCardProps {
  title: string;
  children: React.ReactNode;
  headerGradient?: string;
  titleColor?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

export const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  title,
  children,
  headerGradient = "bg-gradient-to-r from-slate-50 to-slate-100",
  titleColor = "text-gray-900",
  action
}) => (
  <Card>
    <CardHeader className={`${headerGradient} border-b pb-3`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <CardTitle className={`text-lg font-bold ${titleColor}`}>
          {title}
        </CardTitle>
        {action && (
          <button
            onClick={action.onClick}
            className="flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            {action.icon}
            {action.label}
          </button>
        )}
      </div>
    </CardHeader>
    <CardContent className="p-4">
      {children}
    </CardContent>
  </Card>
);
```

## 📊 Table Components

### 1. ResponsiveTable
**Purpose**: Table with horizontal scroll and responsive container
```tsx
interface Column {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

interface ResponsiveTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  actions?: (row: any) => React.ReactNode;
  minWidth?: string;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  columns,
  data,
  onRowClick,
  actions,
  minWidth = "800px"
}) => (
  <div className="overflow-x-auto">
    <div className="max-h-80 overflow-y-auto">
      <table className={`w-full text-xs`} style={{ minWidth }}>
        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
          <tr>
            {columns.map(column => (
              <th
                key={column.key}
                className={`px-2 py-2 text-${column.align || 'left'} text-gray-700 font-medium ${column.width || ''}`}
              >
                {column.label}
              </th>
            ))}
            {actions && <th className="px-2 py-2 text-center text-gray-700 font-medium w-12">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, index) => (
            <tr 
              key={index}
              className={`hover:bg-blue-50/50 transition-colors ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
              } ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map(column => (
                <td
                  key={column.key}
                  className={`px-2 py-2 text-${column.align || 'left'}`}
                >
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
              {actions && (
                <td className="px-2 py-2 text-center">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
```

## 🎯 Module-Specific Components

### 1. ARInvoiceCard
**Purpose**: AR-specific card with blue theme
```tsx
export const ARInvoiceCard: React.FC<ResponsiveCardProps> = (props) => (
  <ResponsiveCard
    {...props}
    headerGradient="bg-gradient-to-r from-blue-50 to-slate-50"
    titleColor="text-gray-900"
  />
);
```

### 2. APInvoiceCard
**Purpose**: AP-specific card with slate theme
```tsx
export const APInvoiceCard: React.FC<ResponsiveCardProps> = (props) => (
  <ResponsiveCard
    {...props}
    headerGradient="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900"
    titleColor="text-slate-800 dark:text-slate-200"
  />
);
```

### 3. JournalEntryCard
**Purpose**: JE-specific card with indigo theme
```tsx
export const JournalEntryCard: React.FC<ResponsiveCardProps> = (props) => (
  <ResponsiveCard
    {...props}
    headerGradient="bg-gradient-to-r from-indigo-50 to-purple-50"
    titleColor="text-indigo-900"
  />
);
```

## 🎨 Utility Components

### 1. AmountDisplay
**Purpose**: Consistent amount formatting with color coding
```tsx
interface AmountDisplayProps {
  amount: number;
  currency?: string;
  variant?: 'currency' | 'base' | 'vat' | 'total';
  size?: 'sm' | 'md' | 'lg';
}

export const AmountDisplay: React.FC<AmountDisplayProps> = ({
  amount,
  currency = 'USD',
  variant = 'base',
  size = 'md'
}) => {
  const variantClasses = {
    currency: 'bg-blue-50 text-blue-800 border-blue-200',
    base: 'bg-gray-50 text-gray-600 border-gray-200',
    vat: 'bg-amber-50 text-amber-800 border-amber-200',
    total: 'bg-green-50 text-green-800 border-green-300'
  };

  const sizeClasses = {
    sm: 'text-xs px-1 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-lg px-3 py-2 font-bold'
  };

  return (
    <div className={`${variantClasses[variant]} ${sizeClasses[size]} rounded border text-center`}>
      {currency === 'USD' ? '$' : currency + ' '}{amount.toFixed(2)}
    </div>
  );
};
```

### 2. StatusIndicator
**Purpose**: Visual status indicators for invoices/entries
```tsx
interface StatusIndicatorProps {
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'posted';
  size?: 'sm' | 'md';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md'
}) => {
  const statusConfig = {
    draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
    rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
    posted: { color: 'bg-blue-100 text-blue-800', label: 'Posted' }
  };

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5';

  return (
    <span className={`${statusConfig[status].color} ${sizeClasses} rounded-full font-medium`}>
      {statusConfig[status].label}
    </span>
  );
};
```

## 📱 Responsive Patterns

### Breakpoint Usage Guide
```tsx
// Mobile-first responsive patterns used throughout the app

// Navigation layout
"flex flex-col sm:flex-row"          // Stack on mobile, side-by-side on tablet+

// Button groups  
"w-full sm:w-auto"                   // Full width on mobile, auto on tablet+

// Grid layouts
"grid-cols-1 md:grid-cols-2 lg:grid-cols-4"  // 1 col mobile, 2 tablet, 4 desktop

// Compact grouping
"grid-cols-2 gap-2"                  // Always 2 columns for related fields

// Spacing
"gap-2 sm:gap-3"                     // Smaller gaps on mobile
"p-2 sm:p-4"                         // Less padding on mobile

// Text sizing
"text-xs sm:text-sm"                 // Smaller text on mobile when needed
```

## 🔧 Usage Examples

### Complete Page Example
```tsx
import { 
  PageContainer, 
  ResponsiveNavigation, 
  ContentWrapper, 
  ARInvoiceCard,
  ResponsiveFormGrid,
  CompactFieldGroup,
  FormField 
} from './components';

export default function CreateARInvoice() {
  return (
    <PageContainer>
      <ResponsiveNavigation
        backLabel="AR-Explorer"
        onBack={() => router.push('/ar')}
        actions={[
          {
            label: 'Save Draft',
            onClick: handleSave,
            variant: 'secondary',
            icon: <Save className="w-4 h-4" />
          },
          {
            label: 'Submit for Approval',
            onClick: handleSubmit,
            variant: 'primary'
          }
        ]}
      />
      
      <ContentWrapper>
        <ARInvoiceCard
          title="AR Invoice Header"
          action={{
            label: 'Add Line',
            onClick: addLine,
            icon: <Plus className="w-4 h-4" />
          }}
        >
          <ResponsiveFormGrid>
            {/* Column 1 */}
            <div className="space-y-3">
              <FormField label="Invoice Type" type="select" options={invoiceTypes} />
              <FormField label="Invoice Number" value={invoiceNumber} onChange={setInvoiceNumber} />
            </div>
            
            {/* Column 2 */}
            <div className="space-y-3">
              <FormField label="Customer" type="select" options={customers} />
              <CompactFieldGroup>
                <FormField label="Invoice Date" type="date" compact />
                <FormField label="Due Date" type="date" compact />
              </CompactFieldGroup>
            </div>
            
            {/* Column 3 */}
            <div className="space-y-3">
              <CompactFieldGroup>
                <FormField label="Company" type="select" options={companies} compact />
                <FormField label="Currency" type="select" options={currencies} compact />
              </CompactFieldGroup>
              <FormField label="Amount" type="number" />
            </div>
            
            {/* Column 4 */}
            <div className="space-y-3">
              <FormField label="Comments" type="textarea" rows={3} />
            </div>
          </ResponsiveFormGrid>
        </ARInvoiceCard>
      </ContentWrapper>
    </PageContainer>
  );
}
```

---

**📝 Note**: These components are designed to be extracted into a shared component library for consistency across all accounting modules.

**🔄 Maintenance**: Update this library when new patterns emerge or existing patterns are optimized.
