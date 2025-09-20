# Accounting App UI Standards & Guidelines

## Table of Contents
1. [Overview](#overview)
2. [Responsive Design Standards](#responsive-design-standards)
3. [Layout Patterns](#layout-patterns)
4. [Component Standards](#component-standards)
5. [Navigation Patterns](#navigation-patterns)
6. [Form Standards](#form-standards)
7. [Table Standards](#table-standards)
8. [Color Scheme](#color-scheme)
9. [Typography](#typography)
10. [Implementation Examples](#implementation-examples)
11. [Best Practices](#best-practices)

## Overview

This document defines the UI/UX standards for the Shipnet 2.0 Accounting App. These standards ensure consistency, responsive design, and optimal user experience across all accounting modules (AR, AP, JE).

### Core Principles
- **Mobile-First Responsive Design**: All interfaces must work seamlessly across devices
- **Compact Layouts**: Efficient use of screen space with grouped related fields
- **Consistent Patterns**: Reusable components and layout patterns
- **Accessibility**: Clear typography, proper contrast, and keyboard navigation
- **Performance**: Optimized for fast loading and smooth interactions

## Responsive Design Standards

### Breakpoints
```css
/* Mobile First Approach */
mobile: 'default (320px+)'
sm: '640px+'    /* Small tablets, large phones */
md: '768px+'    /* Tablets */
lg: '1024px+'   /* Desktop */
xl: '1280px+'   /* Large desktop */
```

### Grid System
```tsx
// Standard responsive grid pattern
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Content */}
</div>

// Compact field grouping (2 fields per row)
<div className="grid grid-cols-2 gap-2">
  {/* Related fields */}
</div>
```

### Container Standards
```tsx
// Main page container
<div className="min-h-screen bg-slate-50 dark:bg-slate-900">
  
// Content wrapper
<div className="p-2 sm:p-4 max-w-full mx-auto space-y-4">
```

## Layout Patterns

### 1. Page Structure Template
```tsx
export default function AccountingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Navigation Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Navigation content */}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-2 sm:p-4 max-w-full mx-auto space-y-4">
        {/* Page content */}
      </div>
    </div>
  );
}
```

### 2. Card Header Pattern
```tsx
<CardHeader className="pb-3">
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
    <CardTitle className="text-lg font-bold text-gray-900">
      Section Title
    </CardTitle>
    <button className="flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors w-full sm:w-auto">
      <Icon className="w-4 h-4" />
      Action
    </button>
  </div>
</CardHeader>
```

## Component Standards

### 1. Navigation Buttons
```tsx
// Back navigation
<button 
  onClick={handleBack}
  className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
>
  <ArrowLeft className="w-4 h-4" />
  <span className="text-sm font-medium">Module-Explorer</span>
</button>

// Action buttons (responsive)
<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 text-white text-sm rounded-md hover:bg-slate-700 transition-colors shadow-sm">
    <Save className="w-4 h-4" />
    Save Draft
  </button>
  <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors shadow-sm">
    Submit for Approval
  </button>
</div>
```

### 2. Form Field Groups
```tsx
// Standard field group
<div className="space-y-1">
  <label className="text-xs font-medium text-gray-600 block">Field Label</label>
  <input
    type="text"
    className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
    value={value}
    onChange={handleChange}
  />
</div>

// Compact field group (for grouped fields)
<div className="space-y-1">
  <label className="text-xs font-medium text-gray-600 block">Field Label</label>
  <input
    type="text"
    className="w-full px-1 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-xs"
    value={value}
    onChange={handleChange}
  />
</div>
```

## Navigation Patterns

### 1. Module Navigation
- **Format**: `{Module}-Explorer` (e.g., "AR-Explorer", "AP-Explorer")
- **Icon**: `ArrowLeft` for back navigation
- **Positioning**: Top-left of navigation bar

### 2. Action Buttons
- **Save Draft**: Secondary button (slate background)
- **Submit/Post**: Primary button (blue background)
- **Mobile**: Full-width buttons, stacked vertically
- **Desktop**: Side-by-side buttons

## Form Standards

### 1. Header Layout (4-Column Responsive Grid)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Column 1: Basic Info */}
  <div className="space-y-3">
    {/* Type, Number fields */}
  </div>
  
  {/* Column 2: Entity & Dates */}
  <div className="space-y-3">
    <div className="space-y-1">
      {/* Entity selection */}
    </div>
    {/* Date fields in compact layout */}
    <div className="grid grid-cols-2 gap-2">
      <div className="space-y-1">{/* Date 1 */}</div>
      <div className="space-y-1">{/* Date 2 */}</div>
    </div>
  </div>
  
  {/* Column 3: Financial Info */}
  <div className="space-y-3">
    {/* Financial fields in compact layout */}
    <div className="grid grid-cols-2 gap-2">
      <div className="space-y-1">{/* Field 1 */}</div>
      <div className="space-y-1">{/* Field 2 */}</div>
    </div>
  </div>
  
  {/* Column 4: Comments & Attachments */}
  <div className="space-y-3">
    {/* Comments and file uploads */}
  </div>
</div>
```

### 2. Compact Field Groupings
- **Dates**: Invoice Date + Due Date
- **Financial**: Company + Currency, Amount + Tax Rate
- **Entity Info**: Code + Name, Phone + Email
- **References**: Reference Number + Reference Date

### 3. Field Sizing Standards
- **Standard fields**: `text-sm`, `px-2 py-1.5`
- **Compact fields**: `text-xs`, `px-1 py-1.5`
- **Date inputs**: Always compact sizing
- **Select dropdowns**: Match input field sizing

## Table Standards

### 1. Responsive Table Container
```tsx
<CardContent className="p-0">
  <div className="overflow-x-auto">
    <div className="max-h-80 overflow-y-auto">
      <table className="w-full text-xs min-w-[800px]">
        {/* Table content */}
      </table>
    </div>
  </div>
</CardContent>
```

### 2. Table Header Pattern
```tsx
<thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
  <tr>
    <th className="px-2 py-2 text-center text-gray-700 font-medium w-12">#</th>
    <th className="px-2 py-2 text-left text-gray-700 font-medium w-32">Account</th>
    <th className="px-2 py-2 text-left text-gray-700 font-medium">Description</th>
    {/* More columns */}
  </tr>
</thead>
```

### 3. Journal Entry Amount Pattern (+ / -)
```tsx
// Single amount field with +/- indicator
<div className="space-y-1">
  <label className="text-xs font-medium text-gray-600 block">Amount</label>
  <div className="flex items-center gap-1">
    <select 
      className="w-12 px-1 py-1 text-xs text-center border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      value={line.isDebit ? '+' : '-'}
      onChange={(e) => handleSignChange(line.id, e.target.value === '+')}
    >
      <option value="+">+</option>
      <option value="-">-</option>
    </select>
    <input
      type="number"
      step="0.01"
      className="flex-1 px-2 py-1 text-xs text-right border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      value={line.amount || ''}
      onChange={(e) => handleAmountChange(line.id, parseFloat(e.target.value) || 0)}
    />
  </div>
</div>
```

## Color Scheme

### 1. Background Colors
```css
/* Page backgrounds */
bg-slate-50 dark:bg-slate-900        /* Main page background */
bg-white dark:bg-slate-800           /* Card/section backgrounds */
bg-gray-50 dark:bg-slate-900         /* Table headers, secondary sections */

/* Status indicators */
bg-blue-50                           /* Currency amounts */
bg-gray-50                           /* Base amounts */
bg-amber-50                          /* VAT amounts */
bg-green-50                          /* Total amounts */
```

### 2. Text Colors
```css
/* Primary text */
text-gray-900 dark:text-slate-100    /* Main content */
text-gray-600 dark:text-slate-400    /* Labels */
text-gray-700                        /* Table headers */

/* Status text */
text-blue-800                        /* Currency amounts */
text-gray-600                        /* Base amounts */
text-amber-800                       /* VAT amounts */
text-green-800                       /* Total amounts */
```

### 3. Interactive Elements
```css
/* Buttons */
bg-blue-600 hover:bg-blue-700        /* Primary actions */
bg-slate-600 hover:bg-slate-700      /* Secondary actions */
bg-red-600 hover:bg-red-700          /* Destructive actions */

/* Form elements */
border-gray-300 focus:border-blue-500 /* Form inputs */
ring-blue-500                        /* Focus states */
```

## Typography

### 1. Text Sizing
```css
text-lg font-bold                    /* Page/section titles */
text-sm font-medium                  /* Navigation text */
text-xs font-medium                  /* Field labels */
text-xs                              /* Compact field text */
text-sm                              /* Standard field text */
```

### 2. Font Weights
- `font-bold`: Titles, totals, important amounts
- `font-medium`: Labels, navigation items
- `font-normal`: Standard content (default)

## Implementation Examples

### 1. Complete AR Invoice Header
```tsx
<Card>
  <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b pb-3">
    <CardTitle className="text-lg font-bold text-gray-900">
      AR Invoice Header
    </CardTitle>
  </CardHeader>
  
  <CardContent className="p-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Implementation follows standards above */}
    </div>
  </CardContent>
</Card>
```

### 2. Complete AP Invoice Header
```tsx
<Card>
  <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b pb-3">
    <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200">
      AP Invoice Header
    </CardTitle>
  </CardHeader>
  
  <CardContent className="p-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Implementation follows standards above */}
    </div>
  </CardContent>
</Card>
```

### 3. Complete Journal Entry Header
```tsx
<Card>
  <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b pb-3">
    <CardTitle className="text-lg font-bold text-indigo-900">
      Journal Entry Header
    </CardTitle>
  </CardHeader>
  
  <CardContent className="p-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Implementation follows standards above */}
    </div>
  </CardContent>
</Card>
```

## Best Practices

### 1. Responsive Design
- ✅ Always start with mobile-first design
- ✅ Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` for main layouts
- ✅ Use `grid-cols-2 gap-2` for compact field groupings
- ✅ Add horizontal scroll for tables (`overflow-x-auto`, `min-w-[800px]`)
- ✅ Stack navigation buttons vertically on mobile

### 2. Performance
- ✅ Use Tailwind classes consistently
- ✅ Minimize custom CSS
- ✅ Lazy load large components
- ✅ Optimize images and icons

### 3. Accessibility
- ✅ Provide clear labels for all form fields
- ✅ Maintain proper color contrast ratios
- ✅ Support keyboard navigation
- ✅ Use semantic HTML elements

### 4. Code Organization
- ✅ Follow consistent component structure
- ✅ Use TypeScript for type safety
- ✅ Implement proper error handling
- ✅ Document complex components

### 5. Testing
- ✅ Test across different screen sizes
- ✅ Verify responsive behavior
- ✅ Test keyboard navigation
- ✅ Validate form submissions

## Module-Specific Considerations

### AR (Accounts Receivable)
- Focus on customer information and invoice details
- Blue color scheme for currency/amount highlights
- Customer selection with info popup

### AP (Accounts Payable)
- Focus on vendor information and expense tracking
- Slate/gray color scheme for professional appearance
- Expense account categorization

### JE (Journal Entry)
- Focus on chart of accounts and balance validation
- Indigo/purple color scheme for journal specificity
- +/- amount system instead of separate debit/credit

---

**Last Updated**: September 1, 2025  
**Version**: 1.0  
**Maintainer**: Shipnet Development Team

> 📝 **Note**: This document should be referenced for all new screen development in the Accounting App. Any deviations from these standards should be documented and approved by the development team.
