# Copilot Pro Prompt Templates — Registers

Use these prompts in Copilot Pro to scaffold new register master-data modules consistent with the Shipnet 2.0 project patterns (models, schemas, services, transformers, UI, orchestrator).

## Template: Scaffold a New Register (Full Pattern)

Prompt:
"Create a new register called `{{ResourceName}}` following the Accounts/Account Groups pattern in the Shipnet 2.0 repo.

**Backend Integration:**
- Add TypeScript models in `packages/ui/libs/registers/{{resource}}/models.ts` with proper DTO interfaces.
- Add Zod schemas for create/update in `packages/ui/libs/registers/{{resource}}/schemas.ts`.
- Add API wrappers in `packages/ui/libs/registers/{{resource}}/services.ts` using `createApiClient(getApiUrl(API_CONFIG.ENDPOINTS.<RESOURCE> || '/api/{{resource}}'))` with endpoints GET list, GET by id, POST addOrUpdate, DELETE, and a validate endpoint.
- Add transformers/parsers in `apps/registers/app/{{resource}}/libs/transformers.ts` to normalize initial data and prepare payloads for server (serialize JSON fields if needed).
- Add an orchestrator in `apps/registers/app/{{resource}}/libs/{{resource}}Service.ts` to run Zod validation, custom table validation, prepare payload, call API and show notifications.

**Modern UI Pattern:**
- Create `apps/registers/app/{{resource}}/components/{{Resource}}Explorer.tsx` with paper-like container design
- Create `apps/registers/app/{{resource}}/components/Custom{{Resource}}Table.tsx` with inline editing capabilities
- Create `apps/registers/app/{{resource}}/components/{{Resource}}Form.tsx` for detailed editing
- Use horizontal tabs for filtering instead of sidebar navigation
- Implement split UX: row-click inline editing with Save/Cancel, and the Edit action navigates to a dedicated edit page at `/{{resource}}/edit?id=...`
- Include search functionality and progressive UI space
- Export new models/services/schemas from `packages/ui/src/index.ts`.

**Design Requirements:**
- Paper-like container: `bg-white rounded-lg shadow-lg border border-gray-300`
- Horizontal filter tabs with counts: `bg-blue-100 text-blue-800 border border-blue-200`
- Inline editing with yellow highlight: `bg-yellow-50` for editing rows
- Click prevention on inputs: `onClick={(e) => e.stopPropagation()}`
- Progressive UI space: 32px height reserved for future features

Be explicit about field types in schemas and add domain rules (e.g., codes unique, numeric lengths) and ensure the orchestrator returns `fieldErrors` for mapping into form UI."

## Template: Create Modern Explorer with Inline Editing

Prompt:
"Generate a `{{Resource}}Explorer.tsx` React component following the Accounts pattern that:

**Structure:**
- Uses paper-like container design with full-height layout
- Implements horizontal tabs for filtering (no sidebar)
- Includes search functionality in header
- Has dedicated progressive UI space at bottom

**Inline Editing Features:**
- Click any row to enable inline editing
- Yellow background (`bg-yellow-50`) for editing rows
- Save/Cancel buttons appear when editing
- Proper event handling to prevent conflicts
- All fields become editable inputs/dropdowns when editing

**Data Management:**
- Load the list from `get{{Resource}}s()` service (no mock data)
- First row is a create-new form row with CreateAR input styling (no background color)
- Filter results based on search and tab selection
- Use DTOs and transformers to map to/from API payloads

**Component Code Pattern:**
```tsx
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../../../../../packages/ui/src/components/ui/button';
import { Input } from '../../../../../packages/ui/src/components/ui/input';
import { {{Resource}}Dto } from '../../../../../packages/ui/libs/registers/{{resource}}/models';
import { Search } from 'lucide-react';
import Custom{{Resource}}Table from './Custom{{Resource}}Table';

// Paper container with horizontal tabs and progressive UI
```

**Required Features:**
- Paper-like styling matching CreateAR page
- Space optimization (no wasted sidebar space)
- Row click to edit functionality
- Professional Odoo-like appearance"

## Template: Create Custom Table Component

Prompt:
"Generate a `Custom{{Resource}}Table.tsx` component with inline editing capabilities:

**Inline Editing Features:**
- Row click triggers edit mode
- Yellow background for editing rows
- Save/Cancel buttons in actions column
- Input fields replace display text when editing
- Event propagation handling for smooth UX

**Table Structure:**
- Create row (blue background) always at top
- All fields as input controls in create row
- Existing rows with click-to-edit functionality
- Status badges and action buttons
- Proper TypeScript interfaces

**Event Handling:**
```tsx
// Row click handler
onClick={() => {
  if (!isEditing) {
    handleEdit(item);
  }
}}

// Prevent propagation on inputs
onClick={(e) => e.stopPropagation()}
```

**Styling:**
- Create row uses CreateAR inputs (no row background): `bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none`
- Yellow edit mode for inline rows: `bg-yellow-50`
- Hover effects: `hover:bg-gray-50 cursor-pointer`
- Keep inputs click-safe: `onClick={(e) => e.stopPropagation()}`"

## Template: Simple Lookup Register

Prompt:
"Generate a minimal lookup register for `{{ResourceName}}` that:
- Only needs models/services/schemas (no complex UI)
- Simple explorer with inline create functionality
- Follows the horizontal tabs pattern but simplified
- 2-3 fields maximum (code, name, description)
- Paper container design for consistency"

## Design Standards Reference

**Paper Container Pattern:**
```css
bg-white rounded-lg shadow-lg border border-gray-300
```

**Horizontal Tabs Pattern:**
```css
/* Active tab */
bg-blue-100 text-blue-800 border border-blue-200

/* Inactive tab */
bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200
```

**Inline Editing States:**
```css
/* Editing row */
bg-yellow-50

/* Create row (inputs only, no row background) */
/* Inputs */ bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500

/* Normal hover */
hover:bg-gray-50 cursor-pointer
```

## Migration Notes

- **Legacy Pattern**: Use `apps/registers/app/ships` as reference for complex registers with EntityTable
- **Modern Pattern**: Use `apps/registers/app/accounts` and `apps/registers/app/account-groups` as reference for new Odoo-like interface
- **Progressive Enhancement**: All new registers should include 32px progressive UI space for future features
- **Space Optimization**: Eliminate sidebars in favor of horizontal tabs within paper containers
