# Shipnet 2.0 - Maritime Chartering Platform

Shipnet 2.0 is a comprehensive maritime chartering platform that handles shipping cost estimates, vessel management, cargo analysis, and port registers. The platform consists of a .NET backend with Azure Functions and a Next.js frontend using Nx monorepo architecture.

## 🏗️ **Architecture Overview**

### **Frontend Applications (Nx Monorepo)**
- **Home** (port 3002): Central dashboard and navigation hub
- **Chartering** (port 3000): Core business logic for cargo analysis and estimates
- **Registers** (port 3001): Master data management (ports, vessels, commodities)
- **Accounting** (port 3003): Financial management and reporting
- **Voyage Manager** (port 3004): Advanced voyage planning and tracking
- **Auth** (port 3005): Centralized authentication service

## 🚀 **Quick Start Commands**

### **Development**
```bash
# Start all apps concurrently
npm run dev

# Start individual apps
npm run dev:chartering    # Chartering app
npm run dev:registers     # Registers app
npm run dev:home          # Home app
npm run dev:accounting    # Accounting app
npm run dev:voyagemanager # Voyage Manager app
```

## 📁 **Project Structure**

### **Frontend (`frontend/`)**
```
frontend/
├── apps/
│   ├── home/             # Central dashboard (port 3002)
│   ├── chartering/       # Main business application
│   ├── registers/        # Master data management
│   ├── accounting/       # Financial management
│   ├── voyagemanager/    # Voyage planning
│   └── auth/             # Authentication service
├── packages/
│   └── ui/               # Shared UI components and utilities
```

## 🔧 **Key Components**

### **Backend Services**
- `Chartering/Services/EstimateService.cs` - Estimation business logic
- `Registers/Services/VesselService.cs` - Vessel management operations

### **Frontend Features**
- `apps/chartering/src/app/cargo-analysis/` - Main estimation UI and logic
- `apps/chartering/src/app/estimates/` - Estimate management

## 🧪 **Testing**

### **Frontend Testing**
```bash
# Test chartering app
cd apps/chartering && npm test

# Test all apps
npm run test:all
```

## 🔄 **Development Workflow**

### **Adding New Features**
1. Update `Chartering/DTOs/EstimateDto.cs`
2. Modify `Chartering/Services/EstimateService.cs`
3. Update frontend components
4. Add tests
5. Update documentation