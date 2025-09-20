# Shipnet Frontend Applications

This directory contains the frontend applications for the Shipnet Maritime Management System.

## Application Structure

## 🔄 Multi-Port Architecture Benefits

The Shipnet application uses separate ports for each module, providing several key advantages:

### **Independent Development & Deployment**
- **Parallel Development**: Teams can work on different modules simultaneously without conflicts
- **Independent Releases**: Each module can be deployed independently without affecting others
- **Technology Flexibility**: Different modules can use different frameworks or versions if needed

### **Performance & Scalability**
- **Resource Optimization**: Only load the specific module needed, reducing bundle size
- **Memory Efficiency**: Each application runs in its own process with dedicated memory
- **CPU Distribution**: Load is distributed across multiple Node.js processes

### **Fault Isolation & Reliability**
```
❌ Single Port Issue:
If accounting crashes → Entire system down

✅ Multi-Port Advantage:
If accounting crashes → Only accounting affected
Operations, Registers, Home still functional
```

### **Development Benefits**
- **Selective Testing**: Test individual modules in isolation
- **Environment Management**: Each module can have different configurations
- **Granular Monitoring**: Track performance per business domain
- **Container Deployment**: Easy Docker containerization per module

### **Port Assignment**
- **Home**: 3002 (Central navigation hub)
- **Accounting**: 3003 (Financial management)
- **Chartering**: 3000 (Voyage & cargo operations)
- **Registers**: 3001 (Master data management)

### 📁 /frontend/apps/home
**Common Landing Page **
- **Port**: 3002
- **Purpose**: Central hub for navigating between different applications
- **Features**:
  - Module tiles for Accounting (ACC), Operations (OPS), and Registers (Master Data)
  - Responsive design with icons, titles, and descriptions
  - Routes to respective application dashboards

#### Key Files:
```
apps/home/
├── package.json                    # Dependencies and scripts
├── next.config.ts                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── eslint.config.mjs               # ESLint configuration
├── public/                         # Static assets
└── src/
    └── app/
        ├── layout.tsx              # Root layout
        ├── page.tsx                # Landing page with module tiles
        └── globals.css             # Global styles
```

### 📁 /frontend/apps/accounting
**Financial Management Application**
- **Port**: 3003
- **Purpose**: Comprehensive accounting and financial management
- **Features**:
  - Side dockable menu (collapsible on desktop, bottom dock on mobile)
  - Responsive grid layout with KPI tiles and charts
  - Dark/light theme support

#### Module Structure:
```
apps/accounting/
├── package.json                    # Dependencies including recharts
├── next.config.ts                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── eslint.config.mjs               # ESLint configuration
├── public/                         # Static assets
└── src/
    ├── components/
    │   ├── AccountingSidebar.tsx   # Persistent navigation sidebar
    │   └── ComingSoonPage.tsx      # Reusable coming soon template
    └── app/
        ├── layout.tsx              # Root layout with sidebar
        ├── page.tsx                # Main accounting dashboard
        ├── ar/                     # Accounts Receivable
        │   └── page.tsx
        ├── ap/                     # Accounts Payable
        │   └── page.tsx
        ├── journals/               # Transaction Recording
        │   └── page.tsx
        ├── chart-of-accounts/      # Chart of Accounts
        │   └── page.tsx
        ├── reconciliation/         # Cash & Bank Reconciliation
        │   └── page.tsx
        ├── financial-statements/   # Financial Statements
        │   └── page.tsx
        ├── reports/                # Control & Tax Reports
        │   └── page.tsx
        ├── budget/                 # Budget Management
        │   └── page.tsx
        ├── integration/            # Import/Export
        │   └── page.tsx
        ├── compliance/             # Audit Logs & Compliance
        │   └── page.tsx
        └── globals.css             # Global styles
```

#### Accounting Dashboard Modules:

1. **Accounts Receivable (AR)** - `/accounting/ar`
   - Customer invoices, payments, outstanding balances
   - Customer management, aging reports

2. **Accounts Payable (AP)** - `/accounting/ap`
   - Vendor bills, payments, supplier management
   - Vendor management, payment processing

3. **Transaction Recording** - `/accounting/journals`
   - Journals, VAT/GST, Multi-Currency, Multi-Company
   - Journal entries, tax management

4. **Chart of Accounts** - `/accounting/chart-of-accounts`
   - Account hierarchy and configuration
   - Account structure management

5. **Cash & Bank Reconciliation** - `/accounting/reconciliation`
   - Bank statement reconciliation
   - Cash management tools

6. **Financial Statements** - `/accounting/financial-statements`
   - P&L, Balance Sheet, Cash Flow reports
   - Consolidated reporting

7. **Control & Tax Reports** - `/accounting/reports`
   - Trial Balance, General Ledger, VAT/GST, Variance
   - Compliance and control reporting

8. **Budget** - `/accounting/budget`
   - Budget planning and tracking
   - Variance analysis

9. **Integration** - `/accounting/integration`
   - Import/Export functionality
   - System integrations

10. **Compliance** - `/accounting/compliance`
    - Audit Logs, Role Management
    - Security and compliance features

### 📁 /frontend/apps/chartering
**Voyage & Cargo Operations Application**
- **Port**: 3000
- **Purpose**: Core business logic for maritime operations
- **Features**:
  - Cargo analysis and estimation
  - Voyage planning and optimization
  - Cost calculations and routing
  - Drag-and-drop interfaces for operational workflows

#### Key Files:
```
apps/chartering/
├── package.json                    # Dependencies and scripts
├── next.config.ts                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── eslint.config.mjs               # ESLint configuration
├── public/                         # Static assets
└── src/
    └── app/
        ├── layout.tsx              # Root layout
        ├── page.tsx                # Main operations dashboard
        ├── cargo-analysis/         # Cargo analysis and estimation
        │   ├── page.tsx
        │   └── components/
        ├── estimates/              # Estimate management
        │   ├── page.tsx
        │   └── components/
        └── globals.css             # Global styles
```

#### Chartering Dashboard Modules:

1. **Cargo Analysis** - `/chartering/cargo-analysis`
   - Cargo specifications and requirements
   - Vessel selection and optimization
   - Route planning and distance calculations

2. **Estimates** - `/chartering/estimates`
   - Cost estimation and budgeting
   - Voyage planning and scheduling
   - Financial analysis and reporting

### 📁 /frontend/apps/registers
**Existing Registers Application**
- **Port**: 3001
- **Modules**: Ships, Ports, Vessel Types, Grades, etc.
- **Status**: Unchanged (maintained by other team)

## Routing Structure

### Application URLs:
- **Home**: `http://localhost:3002/`
- **Accounting**: `http://localhost:3003/accounting`
- **Operations**: `http://localhost:3000` (existing)
- **Registers**: `http://localhost:3001` (existing)

### Accounting Module Routes:
- Dashboard: `/accounting`
- Accounts Receivable: `/accounting/ar`
- Accounts Payable: `/accounting/ap`
- Transaction Recording: `/accounting/journals`
- Chart of Accounts: `/accounting/chart-of-accounts`
- Cash & Bank Reconciliation: `/accounting/reconciliation`
- Financial Statements: `/accounting/financial-statements`
- Control & Tax Reports: `/accounting/reports`
- Budget: `/accounting/budget`
- Integration: `/accounting/integration`
- Compliance: `/accounting/compliance`

## Technology Stack

- **Framework**: Next.js 15.4.1
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui components
- **Icons**: lucide-react
- **Charts**: Recharts
- **State Management**: React built-in (useState, useEffect)
- **Routing**: Next.js App Router

## Design Features

### Common Landing Page (Home):
- **Gradient Background**: Modern glass-morphism design
- **Module Tiles**: Interactive cards with hover effects
- **Responsive Grid**: 1-3 columns based on screen size
- **Navigation**: Click to open respective applications

### Accounting Application:
- **Sidebar Navigation**: 
  - Collapsible on desktop (16px collapsed, 256px expanded)
  - Bottom dock on mobile (persistent across module pages)
  - Module icons and labels
- **Dashboard KPIs**: Revenue, AR, AP, Cash Flow with trend indicators
- **Quick Actions**: Common tasks (New Invoice, Record Payment, etc.)
- **Module Grid**: Interactive tiles for each accounting module
- **Recent Activity**: Timeline of recent transactions

### Theme Support:
- **Colors**: Consistent color scheme across applications
- **Dark/Light Mode**: Built-in support via Tailwind CSS
- **Responsive**: Mobile-first design principles
- **Accessibility**: ARIA labels and keyboard navigation

## Getting Started

### Prerequisites:
- Node.js 18+ 
- npm or yarn package manager

### Installation:
1. Navigate to the frontend directory
2. Install dependencies for each app:
   ```bash
   # Home app
   cd apps/home && npm install
   
   # Accounting app  
   cd ../accounting && npm install
   ```

### Development:
Run each application in separate terminals:

```bash
# Home app (port 3002)
cd apps/home && npm run dev

# Accounting app (port 3003)
cd apps/accounting && npm run dev

# Operations app (port 3000) - existing
cd apps/chartering && npm run dev

# Registers app (port 3001) - existing  
cd apps/registers && npm run dev
```

### Production:
Build and start each application:

```bash
# Build all apps
cd apps/home && npm run build
cd ../accounting && npm run build

# Start production servers
cd apps/home && npm start
cd ../accounting && npm start
```

## Notes

- **Existing Apps**: Operations and Registers apps remain untouched
- **Cross-Navigation**: Home app routes to other applications via external URLs
- **State Persistence**: Accounting sidebar state persists across module pages

- **TypeScript**: Consistent TypeScript configuration across all new applications

## 🚀 Multi-Port Development Workflow

### **Development Best Practices**

#### **Running Selective Modules**
```bash
# Run only what you need for development
npm run dev  # In accounting app (port 3003) only
npm run dev  # In operations app (port 3000) only
npm run dev  # In home app (port 3002) for navigation testing
```

#### **Health Monitoring**
```bash
# Check if all applications are running
curl http://localhost:3000  # Operations
curl http://localhost:3001  # Registers  
curl http://localhost:3002  # Home
curl http://localhost:3003  # Accounting
```

#### **Process Management**
```bash
# Kill all Node.js processes if needed
taskkill /f /im node.exe  # Windows
# or
pkill node  # Linux/macOS
```

### **Production Deployment Strategy**

#### **Docker Compose Example**
```yaml
services:
  home:
    build: ./apps/home
    ports: ["3002:3002"]
    
  accounting:
    build: ./apps/accounting
    ports: ["3003:3003"]
    deploy:
      replicas: 2
      
  operations:
    build: ./apps/chartering
    ports: ["3000:3000"]
    deploy:
      replicas: 3  # Higher load expected
      
  registers:
    build: ./apps/registers
    ports: ["3001:3001"]
```

#### **Load Balancer Configuration**
```nginx
# Nginx example
upstream accounting {
    server localhost:3003;
}

upstream operations {
    server localhost:3000;
}

location /accounting/ {
    proxy_pass http://accounting;
}

location /operations/ {
    proxy_pass http://operations;
}
```

### **Monitoring & Debugging**

#### **Module-Specific Monitoring**
```bash
# Monitor specific module performance
npm run monitor:accounting  # Port 3003 metrics
npm run monitor:operations  # Port 3000 metrics
```

#### **Log Aggregation**
```bash
# Centralized logging for all modules
npm run logs:all     # All applications
npm run logs:accounting  # Accounting only
npm run logs:operations  # Operations only
```

### **Security Considerations**

#### **API Gateway Integration**
```
API Gateway (Port 80/443)
├── /accounting/* → Port 3003
├── /operations/* → Port 3000
├── /registers/*  → Port 3001
└── /home/*       → Port 3002
```

#### **Environment Variables**
```bash
# Shared configuration
NEXT_PUBLIC_API_URL=https://api.shipnet.com
NEXT_PUBLIC_HOME_URL=http://localhost:3002

# Module-specific configuration
ACCOUNTING_DB_URL=postgres://localhost/accounting
OPERATIONS_DB_URL=postgres://localhost/operations
```

### **Troubleshooting**

#### **Common Issues**
1. **Port Conflicts**: Check if ports are already in use
2. **Cross-Module Navigation**: Ensure all target applications are running
3. **Shared Dependencies**: Use `--legacy-peer-deps` for compatibility
4. **Memory Issues**: Monitor memory usage per application

#### **Debug Commands**
```bash
# Check port usage
netstat -ano | findstr :3003  # Windows
lsof -i :3003                 # Linux/macOS

# Check application health
curl -f http://localhost:3003/health || echo "Accounting down"
```
