# Estimates Components

This directory contains components for the estimates module of the chartering application.

## Components

### BunkerPrices

A comprehensive component for displaying latest bunker fuel prices from the API.

**Features:**
- 📊 **Real-time Data**: Fetches latest bunker prices from `getlatestBunkerPrice` API
- 🔍 **Advanced Filtering**: Search by port, country, or fuel grade description
- 📈 **Statistics Dashboard**: Shows total ports, min/max/average prices
- 🎨 **Visual Indicators**: Color-coded prices and fuel grades
- 📋 **Sortable Grid**: Click column headers to sort data
- 📱 **Responsive Design**: Works on all screen sizes
- 🔄 **Auto-refresh**: Manual refresh button for latest data

**Usage:**
```tsx
import BunkerPrices from './components/BunkerPrices';

// Basic usage
<BunkerPrices />

// With custom styling
<BunkerPrices className="my-custom-class" />
```

**API Response Format:**
```json
[
  {
    "PortId": "aeauh",
    "PortName": "Abu Dhabi",
    "CountryName": "United Arab Emirates",
    "PortRank": 7,
    "FuelGradeId": "mgo",
    "FuelGradeDescription": "Marine Gas Oil (MGO)",
    "PublishedDate": "2025-08-14T10:20:01",
    "Price": 786.5
  }
]
```

**Features Breakdown:**

1. **Header Section**
   - Component title with emoji icon
   - Refresh button
   - Total price count badge

2. **Statistics Cards**
   - Total ports count
   - Lowest price (green)
   - Average price (orange)
   - Highest price (red)

3. **Filter Controls**
   - Text search (ports, countries, descriptions)
   - Fuel grade dropdown
   - Country dropdown
   - Clear filters button

4. **Data Grid**
   - Sortable columns (click headers)
   - Color-coded price badges
   - Fuel grade badges with descriptions
   - Port rank indicators
   - Hover effects and alternating row colors

5. **Summary Footer**
   - Shows filtered results count
   - Current filter status

**Color Coding:**
- **Prices**: Green (<$500), Yellow ($500-$800), Red (>$800)
- **Fuel Grades**: HFO (blue), LSFO (purple), MGO (green), VLSFO (orange)

**Accessibility:**
- Keyboard navigation support
- Screen reader friendly
- High contrast color schemes
- Responsive touch targets

### Other Components

- `EstimateExplorer`: Main estimates listing and management
- `EstimateViewer`: Individual estimate display
- `EstimateCargoAnalysisWrapper`: Cargo analysis integration 