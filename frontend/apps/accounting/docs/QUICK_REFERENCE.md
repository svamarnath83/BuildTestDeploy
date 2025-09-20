# Accounting App - Quick Reference Guide

## 🚀 Quick Start Checklist

When creating a new screen in the Accounting App, follow this checklist:

### ✅ Layout Structure
- [ ] Use `min-h-screen bg-slate-50 dark:bg-slate-900` for page container
- [ ] Implement responsive navigation with `flex-col sm:flex-row`
- [ ] Use `p-2 sm:p-4` for main content padding
- [ ] Apply `space-y-4` for consistent vertical spacing

### ✅ Header Grid
- [ ] Use `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4` for main layout
- [ ] Group related fields with `grid grid-cols-2 gap-2`
- [ ] Apply compact sizing: `text-xs px-1 py-1.5` for grouped fields
- [ ] Use standard sizing: `text-sm px-2 py-1.5` for standalone fields

### ✅ Navigation
- [ ] Back button format: `{Module}-Explorer` (e.g., "AR-Explorer")
- [ ] Use `ArrowLeft` icon for back navigation
- [ ] Responsive action buttons: `flex-col sm:flex-row`
- [ ] Full-width buttons on mobile: `w-full sm:w-auto`

### ✅ Tables
- [ ] Add horizontal scroll: `overflow-x-auto`
- [ ] Set minimum width: `min-w-[800px]`
- [ ] Sticky header: `sticky top-0 z-10`
- [ ] Vertical scroll: `max-h-80 overflow-y-auto`

### ✅ Card Headers
- [ ] Responsive flex layout: `flex-col sm:flex-row`
- [ ] Proper gap spacing: `gap-3`
- [ ] Responsive buttons: `w-full sm:w-auto`

## 📋 Copy-Paste Templates

### Page Container
```tsx
<div className="min-h-screen bg-slate-50 dark:bg-slate-900">
  {/* Navigation */}
  <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 shadow-sm">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      {/* Nav content */}
    </div>
  </div>
  
  {/* Main Content */}
  <div className="p-2 sm:p-4 max-w-full mx-auto space-y-4">
    {/* Page content */}
  </div>
</div>
```

### Card with Responsive Header
```tsx
<Card>
  <CardHeader className="pb-3">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <CardTitle className="text-lg font-bold text-gray-900">
        Section Title
      </CardTitle>
      <button className="flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors w-full sm:w-auto">
        <Plus className="w-4 h-4" />
        Add Item
      </button>
    </div>
  </CardHeader>
  <CardContent className="p-4">
    {/* Content */}
  </CardContent>
</Card>
```

### Responsive Form Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Column 1: Basic Info */}
  <div className="space-y-3">
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-600 block">Label</label>
      <input className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm" />
    </div>
  </div>
  
  {/* Column 2: Dates (Compact) */}
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-2">
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600 block">Date 1</label>
        <input type="date" className="w-full px-1 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-xs" />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600 block">Date 2</label>
        <input type="date" className="w-full px-1 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-xs" />
      </div>
    </div>
  </div>
  
  {/* Column 3: Financial (Compact) */}
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-2">
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600 block">Currency</label>
        <select className="w-full px-1 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-xs">
          <option value="USD">USD</option>
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600 block">Amount</label>
        <input type="number" className="w-full px-1 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-xs" />
      </div>
    </div>
  </div>
  
  {/* Column 4: Comments */}
  <div className="space-y-3">
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-600 block">Comments</label>
      <textarea className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm resize-none" rows={3} />
    </div>
  </div>
</div>
```

### Responsive Table
```tsx
<CardContent className="p-0">
  <div className="overflow-x-auto">
    <div className="max-h-80 overflow-y-auto">
      <table className="w-full text-xs min-w-[800px]">
        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
          <tr>
            <th className="px-2 py-2 text-center text-gray-700 font-medium w-12">#</th>
            <th className="px-2 py-2 text-left text-gray-700 font-medium">Description</th>
            <th className="px-2 py-2 text-center text-gray-700 font-medium w-24">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {/* Table rows */}
        </tbody>
      </table>
    </div>
  </div>
</CardContent>
```

### Journal Entry Amount Field (+/-)
```tsx
<div className="space-y-1">
  <label className="text-xs font-medium text-gray-600 block">Amount</label>
  <div className="flex items-center gap-1">
    <select 
      className="w-12 px-1 py-1 text-xs text-center border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      value={isDebit ? '+' : '-'}
    >
      <option value="+">+</option>
      <option value="-">-</option>
    </select>
    <input
      type="number"
      step="0.01"
      className="flex-1 px-2 py-1 text-xs text-right border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
</div>
```

## 🎨 Module Color Schemes

### AR (Accounts Receivable) - Blue Theme
```css
/* Header gradients */
bg-gradient-to-r from-blue-50 to-slate-50

/* Amount highlights */
bg-blue-50 text-blue-800 border-blue-200
```

### AP (Accounts Payable) - Slate Theme
```css
/* Header gradients */
bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900

/* Amount highlights */
bg-slate-50 text-slate-800 border-slate-200
```

### JE (Journal Entry) - Indigo Theme
```css
/* Header gradients */
bg-gradient-to-r from-indigo-50 to-purple-50

/* Amount highlights */
bg-indigo-50 text-indigo-800 border-indigo-200
```

## ⚡ Common Patterns

### Back Navigation Button
```tsx
<button 
  onClick={handleBack}
  className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
>
  <ArrowLeft className="w-4 h-4" />
  <span className="text-sm font-medium">{Module}-Explorer</span>
</button>
```

### Action Button Group
```tsx
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

---

**💡 Remember**: Always refer to `ACCOUNTING_UI_STANDARDS.md` for complete guidelines and detailed explanations.

**🔄 Update Frequency**: Review and update these patterns when creating new components or identifying better practices.
