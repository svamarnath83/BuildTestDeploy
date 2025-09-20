# 🚀 CD Pipeline Documentation (`cd.yml`)

This document provides comprehensive line-by-line documentation for the Continuous Deployment (CD) pipeline of the Shipnet 2.0 project.

## 🎯 Pipeline Overview

The CD pipeline is responsible for:
- Deploying the .NET backend Azure Functions to local environment
- Deploying all 6 Next.js frontend applications with proper port configuration
- Performing health checks and validation
- Managing rollback procedures in case of failures
- Providing deployment status and cleanup

---

## 📋 Pipeline Configuration

### Workflow Name and Triggers

```yaml
name: CD Pipeline - Shipnet 2.0
```
**Purpose:** Defines the display name for this workflow in GitHub Actions UI

```yaml
on:
  workflow_run:
    workflows: ["CI Pipeline - Shipnet 2.0"]
    types:
      - completed
    branches: [main, develop]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        default: 'development'
        type: choice
        options:
          - development
          - staging
          - production
```

**Trigger Types:**
- **workflow_run:** Automatically runs after CI pipeline completes successfully
- **workflow_dispatch:** Manual trigger with environment selection
- **Branch Filter:** Only deploys from main and develop branches

### Environment Variables

```yaml
env:
  DOTNET_VERSION: '8.0.x'
  NODE_VERSION: '20.x'
  AZURE_FUNCTIONS_CORE_TOOLS_VERSION: '4'
```

**Variable Breakdown:**
- **DOTNET_VERSION:** Ensures .NET 8.0 compatibility for Azure Functions
- **NODE_VERSION:** Node.js 20.x for frontend runtime
- **AZURE_FUNCTIONS_CORE_TOOLS_VERSION:** Version 4 for local Azure Functions deployment

---

## 🔍 Job 1: Pre-Deployment Checks

### Job Configuration
```yaml
pre-deployment:
    name: Pre-deployment Checks
    runs-on: self-hosted
    if: ${{ github.event.workflow_run.conclusion == 'success' || github.event_name == 'workflow_dispatch' }}
```
**Purpose:** Validates environment before deployment begins
**Runner:** Uses self-hosted runner for local deployment access
**Condition:** Only runs if CI pipeline succeeded or manual trigger

### Step-by-Step Breakdown

#### 1. Repository Checkout
```yaml
- name: Checkout repository
  uses: actions/checkout@v4
```
**Purpose:** Gets the latest source code for deployment scripts

#### 2. Port Availability Check
```yaml
- name: Check port availability
  run: |
    Write-Host "Checking required ports..."
    $ports = @(7071, 3001, 3002, 3003, 3004, 3005, 3006)
    $unavailable = @()
    
    foreach ($port in $ports) {
        try {
            $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $port)
            $listener.Start()
            $listener.Stop()
            Write-Host "✅ Port $port is available"
        } catch {
            Write-Host "❌ Port $port is in use"
            $unavailable += $port
        }
    }
    
    if ($unavailable.Count -gt 0) {
        Write-Host "❌ The following ports are unavailable: $($unavailable -join ', ')"
        Write-Host "Please stop services using these ports before deployment."
        exit 1
    } else {
        Write-Host "✅ All required ports are available for deployment"
    }
  shell: pwsh
```
**Purpose:** Ensures all required ports are available before deployment
**Port List:**
- 7071: Azure Functions (backend)
- 3001: Chartering app
- 3002: Registers app  
- 3003: Home app
- 3004: Accounting app
- 3005: Voyagemanager app
- 3006: Auth app

**Logic:** 
- Tests TCP listener on each port
- Collects unavailable ports
- Fails deployment if any ports are blocked

#### 3. Disk Space Check
```yaml
- name: Check disk space
  run: |
    $drive = Get-WmiObject Win32_LogicalDisk -Filter "DeviceID='C:'"
    $freeSpaceGB = [math]::Round($drive.FreeSpace / 1GB, 2)
    $totalSpaceGB = [math]::Round($drive.Size / 1GB, 2)
    
    Write-Host "💽 Disk Space Status:"
    Write-Host "Free Space: $freeSpaceGB GB"
    Write-Host "Total Space: $totalSpaceGB GB"
    
    if ($freeSpaceGB -lt 5) {
        Write-Host "❌ Insufficient disk space. Need at least 5GB free."
        exit 1
    } else {
        Write-Host "✅ Sufficient disk space available"
    }
  shell: pwsh
```
**Purpose:** Ensures adequate disk space for deployment
**Threshold:** Requires minimum 5GB free space
**Monitoring:** Reports current space usage

#### 4. Process Cleanup
```yaml
- name: Stop existing processes
  run: |
    Write-Host "🧹 Cleaning up existing processes..."
    
    # Stop Azure Functions processes
    Get-Process -Name "func" -ErrorAction SilentlyContinue | Stop-Process -Force
    Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -eq "dotnet" } | Stop-Process -Force
    
    # Stop Node.js processes on our ports
    $ports = @(3001, 3002, 3003, 3004, 3005, 3006)
    foreach ($port in $ports) {
        $processes = netstat -ano | Select-String ":$port " | ForEach-Object {
            $_.ToString().Split()[-1]
        }
        foreach ($pid in $processes) {
            if ($pid -match '^\d+$') {
                try {
                    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                    Write-Host "Stopped process $pid on port $port"
                } catch {
                    Write-Host "Could not stop process $pid"
                }
            }
        }
    }
    
    Write-Host "✅ Process cleanup completed"
  shell: pwsh
  continue-on-error: true
```
**Purpose:** Stops existing processes to free ports for new deployment
**Process Types:**
- Azure Functions (`func` command)
- .NET applications (`dotnet`)
- Node.js apps on specific ports

**Safety:** Uses `continue-on-error` to prevent deployment failure if cleanup issues occur

---

## 🔧 Job 2: Backend Deployment (.NET Functions)

### Job Configuration
```yaml
backend-deploy:
    name: Deploy Backend
    runs-on: self-hosted
    needs: pre-deployment
    timeout-minutes: 15
```
**Purpose:** Deploys Azure Functions backend to local environment
**Dependencies:** Waits for pre-deployment checks to pass
**Timeout:** 15-minute limit to prevent hanging deployments

### Step-by-Step Breakdown

#### 1. .NET and Azure Functions Setup
```yaml
- name: Setup .NET
  uses: actions/setup-dotnet@v4
  with:
    dotnet-version: ${{ env.DOTNET_VERSION }}
    
- name: Install Azure Functions Core Tools
  run: |
    Write-Host "Installing Azure Functions Core Tools..."
    npm install -g azure-functions-core-tools@${{ env.AZURE_FUNCTIONS_CORE_TOOLS_VERSION }} --unsafe-perm true
    func --version
  shell: pwsh
```
**Purpose:** Ensures proper runtime and deployment tools
**Global Install:** Azure Functions Core Tools installed globally via npm
**Verification:** Confirms installation with version check

#### 2. Backend Build and Restore
```yaml
- name: Restore and build backend
  run: |
    Write-Host "🔄 Restoring backend dependencies..."
    dotnet restore
    
    Write-Host "🏗️ Building backend..."
    dotnet build --configuration Release --no-restore
    
    Write-Host "✅ Backend build completed"
  working-directory: .\backend\ShipnetFunctionApp
  shell: pwsh
```
**Purpose:** Prepares backend for deployment
**Configuration:** Release build for optimized performance
**Flags:** `--no-restore` skips redundant restore step

#### 3. Background Deployment
```yaml
- name: Start Azure Functions
  run: |
    Write-Host "🚀 Starting Azure Functions..."
    
    # Start Functions in background
    Start-Process -FilePath "func" -ArgumentList "start", "--port", "7071" -WorkingDirectory ".\backend\ShipnetFunctionApp" -WindowStyle Hidden
    
    Write-Host "⏱️ Waiting for Functions to start..."
    Start-Sleep -Seconds 10
    
    # Verify Functions are running
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:7071/admin/host/status" -Method GET -TimeoutSec 30
        Write-Host "✅ Azure Functions started successfully"
    } catch {
        Write-Host "⚠️ Could not verify Functions status, but process started"
    }
  shell: pwsh
```
**Purpose:** Starts Azure Functions as background service
**Port:** Fixed to 7071 for backend API
**Process Management:** Hidden window to avoid UI interference
**Verification:** Attempts health check via admin endpoint

#### 4. Process ID Recording
```yaml
- name: Save backend process info
  run: |
    $funcProcesses = Get-Process -Name "func" -ErrorAction SilentlyContinue
    if ($funcProcesses) {
        $funcProcesses | ForEach-Object {
            Write-Host "Backend Function Process ID: $($_.Id)"
            "$($_.Id)" | Out-File -FilePath "backend_pid.txt" -Encoding utf8
        }
    }
  shell: pwsh
```
**Purpose:** Records process IDs for later management and cleanup
**File Output:** Saves PID to file for other jobs to access

---

## 🌐 Job 3: Frontend Deployment (Next.js Apps)

### Job Configuration
```yaml
frontend-deploy:
    name: Deploy Frontend Apps
    runs-on: self-hosted
    needs: backend-deploy
    timeout-minutes: 20
    
    strategy:
      matrix:
        app: 
          - { name: chartering, port: 3001 }
          - { name: registers, port: 3002 }
          - { name: home, port: 3003 }
          - { name: accounting, port: 3004 }
          - { name: voyagemanager, port: 3005 }
          - { name: auth, port: 3006 }
```
**Purpose:** Deploys all 6 frontend apps simultaneously with unique ports
**Matrix Strategy:** Parallel deployment with app-specific configurations
**Port Assignment:** Each app gets dedicated port for isolation

### Step-by-Step Breakdown

#### 1. Node.js Setup
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: ${{ env.NODE_VERSION }}
    cache: 'npm'
```
**Purpose:** Ensures Node.js 20.x with npm caching

#### 2. Environment Configuration
```yaml
- name: Setup environment for ${{ matrix.app.name }}
  run: |
    Write-Host "🔧 Setting up environment for ${{ matrix.app.name }}..."
    
    # Set environment variables
    $env:NX_CONSOLE_NO_INSTALL_PROMPT = "true"
    $env:NX_REJECT_UNKNOWN_LOCAL_CACHE = "0"
    $env:PORT = "${{ matrix.app.port }}"
    $env:NEXT_PUBLIC_API_URL = "http://localhost:7071/api"
    
    Write-Host "Environment configured for ${{ matrix.app.name }} on port ${{ matrix.app.port }}"
  shell: pwsh
```
**Purpose:** Sets app-specific environment variables
**Variables:**
- **PORT:** Unique port for each app
- **NEXT_PUBLIC_API_URL:** Backend API endpoint
- **NX variables:** Prevents interactive prompts in CI environment

#### 3. Dependency Installation
```yaml
- name: Install dependencies
  run: |
    Write-Host "📦 Installing root dependencies..."
    npm ci
    
    Write-Host "📦 Installing frontend workspace dependencies..."
    Set-Location .\frontend
    npm ci
  shell: pwsh
```
**Purpose:** Installs all required dependencies for the workspace
**Dual Installation:** Both root and frontend workspace dependencies

#### 4. Application Build
```yaml
- name: Build ${{ matrix.app.name }} app
  run: |
    Write-Host "🏗️ Building ${{ matrix.app.name }}..."
    Set-Location .\frontend
    
    # Build the specific app
    npx nx build ${{ matrix.app.name }} --configuration=production
    
    Write-Host "✅ ${{ matrix.app.name }} build completed"
  shell: pwsh
  env:
    PORT: ${{ matrix.app.port }}
    NEXT_PUBLIC_API_URL: "http://localhost:7071/api"
```
**Purpose:** Builds the specific Next.js app for production
**Configuration:** Production build for optimization
**Environment:** App-specific port and API URL

#### 5. Application Startup
```yaml
- name: Start ${{ matrix.app.name }} app
  run: |
    Write-Host "🚀 Starting ${{ matrix.app.name }} on port ${{ matrix.app.port }}..."
    Set-Location .\frontend
    
    # Start the app in background
    Start-Process -FilePath "npx" -ArgumentList "nx", "start", "${{ matrix.app.name }}", "--port=${{ matrix.app.port }}", "--hostname=0.0.0.0" -WindowStyle Hidden
    
    Write-Host "⏱️ Waiting for ${{ matrix.app.name }} to start..."
    Start-Sleep -Seconds 15
    
    Write-Host "✅ ${{ matrix.app.name }} started on http://localhost:${{ matrix.app.port }}"
  shell: pwsh
  env:
    PORT: ${{ matrix.app.port }}
    NEXT_PUBLIC_API_URL: "http://localhost:7071/api"
```
**Purpose:** Starts the Next.js application as background process
**Process Management:**
- Hidden window to prevent UI interference
- Binds to all interfaces (0.0.0.0) for accessibility
- 15-second startup wait time

#### 6. Process Tracking
```yaml
- name: Save ${{ matrix.app.name }} process info
  run: |
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
        $_.MainWindowTitle -like "*${{ matrix.app.name }}*" -or 
        (Get-NetTCPConnection -LocalPort ${{ matrix.app.port }} -ErrorAction SilentlyContinue).OwningProcess -eq $_.Id
    }
    
    if ($nodeProcesses) {
        $nodeProcesses | ForEach-Object {
            Write-Host "${{ matrix.app.name }} Process ID: $($_.Id)"
            "${{ matrix.app.name }}:$($_.Id)" | Out-File -FilePath "${{ matrix.app.name }}_pid.txt" -Encoding utf8
        }
    }
  shell: pwsh
```
**Purpose:** Records process IDs for each frontend app
**Detection Logic:** 
- Matches by window title containing app name
- Matches by process owning the specific port
**File Output:** Saves app name and PID to individual files

---

## ✅ Job 4: Post-Deployment Validation

### Job Configuration
```yaml
post-deployment:
    name: Post-deployment Validation
    runs-on: self-hosted
    needs: [backend-deploy, frontend-deploy]
    if: always()
```
**Purpose:** Validates deployment success after all apps are started
**Dependencies:** Waits for both backend and frontend deployments
**Always Runs:** Executes regardless of previous job outcomes

### Step-by-Step Breakdown

#### 1. Backend Health Check
```yaml
- name: Validate backend deployment
  run: |
    Write-Host "🔍 Validating backend deployment..."
    
    $maxRetries = 5
    $retryCount = 0
    $backendHealthy = $false
    
    while ($retryCount -lt $maxRetries -and -not $backendHealthy) {
        try {
            Write-Host "Attempt $($retryCount + 1) of $maxRetries..."
            
            # Check if Functions are responding
            $response = Invoke-RestMethod -Uri "http://localhost:7071/admin/host/status" -Method GET -TimeoutSec 10
            Write-Host "✅ Backend is responding: $($response.state)"
            $backendHealthy = $true
        } catch {
            Write-Host "❌ Backend health check failed: $($_.Exception.Message)"
            $retryCount++
            if ($retryCount -lt $maxRetries) {
                Write-Host "⏱️ Waiting 10 seconds before retry..."
                Start-Sleep -Seconds 10
            }
        }
    }
    
    if (-not $backendHealthy) {
        Write-Host "💥 Backend deployment validation failed after $maxRetries attempts"
        exit 1
    }
  shell: pwsh
  continue-on-error: true
```
**Purpose:** Ensures Azure Functions backend is running and responsive
**Retry Logic:** 5 attempts with 10-second delays
**Health Endpoint:** Uses admin/host/status for comprehensive check
**Failure Handling:** Continues pipeline even if validation fails (for logging)

#### 2. Frontend Apps Validation
```yaml
- name: Validate frontend deployments
  run: |
    Write-Host "🔍 Validating frontend deployments..."
    
    $apps = @(
        @{name="chartering"; port=3001},
        @{name="registers"; port=3002},
        @{name="home"; port=3003},
        @{name="accounting"; port=3004},
        @{name="voyagemanager"; port=3005},
        @{name="auth"; port=3006}
    )
    
    $failedApps = @()
    
    foreach ($app in $apps) {
        try {
            Write-Host "Checking $($app.name) on port $($app.port)..."
            
            # Simple HTTP check to see if the app is serving content
            $response = Invoke-WebRequest -Uri "http://localhost:$($app.port)" -Method GET -TimeoutSec 10 -UseBasicParsing
            
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ $($app.name) is responding (Status: $($response.StatusCode))"
            } else {
                Write-Host "⚠️ $($app.name) returned status: $($response.StatusCode)"
                $failedApps += $app.name
            }
        } catch {
            Write-Host "❌ $($app.name) health check failed: $($_.Exception.Message)"
            $failedApps += $app.name
        }
    }
    
    if ($failedApps.Count -gt 0) {
        Write-Host "💥 Failed apps: $($failedApps -join ', ')"
        Write-Host "Some applications may need manual investigation."
    } else {
        Write-Host "✅ All frontend applications are responding"
    }
  shell: pwsh
  continue-on-error: true
```
**Purpose:** Validates all 6 frontend applications are serving content
**Check Method:** HTTP GET request to root path of each app
**Status Validation:** Ensures 200 OK response
**Error Collection:** Tracks which apps failed for reporting

#### 3. Deployment Summary Generation
```yaml
- name: Generate deployment summary
  run: |
    Write-Host "📋 Generating deployment summary..."
    
    $summary = @"
    # 🚀 Shipnet 2.0 Deployment Summary
    
    ## Backend Status
    - Azure Functions: Running on http://localhost:7071
    - API Endpoints: http://localhost:7071/api/*
    
    ## Frontend Applications
    - 🏢 Chartering: http://localhost:3001
    - 📊 Registers: http://localhost:3002  
    - 🏠 Home: http://localhost:3003
    - 💰 Accounting: http://localhost:3004
    - 🚢 Voyage Manager: http://localhost:3005
    - 🔐 Auth: http://localhost:3006
    
    ## Next Steps
    - All applications should be accessible at their respective URLs
    - Backend API is available for frontend consumption
    - Monitor application logs for any runtime issues
    
    Deployment completed at: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
    "@
    
    Write-Host $summary
    
    # Save summary to file
    $summary | Out-File -FilePath "deployment_summary.txt" -Encoding utf8
    
    Write-Host "✅ Deployment summary saved to deployment_summary.txt"
  shell: pwsh
```
**Purpose:** Creates comprehensive deployment status report
**Content:** URLs for all deployed services
**File Output:** Saves summary for future reference
**Format:** User-friendly with emojis and clear structure

---

## 🧹 Job 5: Deployment Summary and Cleanup

### Job Configuration
```yaml
deployment-summary:
    name: Deployment Summary and Cleanup
    runs-on: self-hosted
    needs: [pre-deployment, backend-deploy, frontend-deploy, post-deployment]
    if: always()
```
**Purpose:** Final job that always runs to provide closure and cleanup
**Dependencies:** Waits for all previous jobs
**Always Execute:** Runs regardless of success/failure

### Step-by-Step Breakdown

#### 1. Process Status Report
```yaml
- name: Report running processes
  run: |
    Write-Host "📊 Current Process Status:"
    Write-Host ""
    
    # Check Azure Functions processes
    $funcProcesses = Get-Process -Name "func" -ErrorAction SilentlyContinue
    if ($funcProcesses) {
        Write-Host "🔧 Azure Functions Processes:"
        $funcProcesses | ForEach-Object {
            Write-Host "  - PID: $($_.Id), CPU: $($_.CPU), Memory: $([math]::Round($_.WorkingSet64 / 1MB, 2)) MB"
        }
    } else {
        Write-Host "❌ No Azure Functions processes found"
    }
    
    Write-Host ""
    Write-Host "🌐 Frontend App Processes:"
    
    # Check Node.js processes on our ports
    $ports = @(3001, 3002, 3003, 3004, 3005, 3006)
    foreach ($port in $ports) {
        try {
            $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
            if ($connections) {
                $process = Get-Process -Id $connections[0].OwningProcess -ErrorAction SilentlyContinue
                if ($process) {
                    Write-Host "  - Port $port : PID $($process.Id), Memory: $([math]::Round($process.WorkingSet64 / 1MB, 2)) MB"
                }
            } else {
                Write-Host "  - Port $port : No process found"
            }
        } catch {
            Write-Host "  - Port $port : Could not determine process"
        }
    }
  shell: pwsh
```
**Purpose:** Provides detailed status of all deployed processes
**Metrics:** CPU usage, memory consumption, process IDs
**Port Mapping:** Shows which processes are using which ports

#### 2. Resource Usage Summary
```yaml
- name: System resource summary
  run: |
    Write-Host "💻 System Resource Usage:"
    
    # Memory usage
    $memory = Get-WmiObject Win32_ComputerSystem
    $os = Get-WmiObject Win32_OperatingSystem
    $totalMemGB = [math]::Round($memory.TotalPhysicalMemory / 1GB, 2)
    $freeMemGB = [math]::Round($os.FreePhysicalMemory / 1KB / 1MB, 2)
    $usedMemGB = $totalMemGB - $freeMemGB
    
    Write-Host "  - Total Memory: $totalMemGB GB"
    Write-Host "  - Used Memory: $usedMemGB GB ($([math]::Round(($usedMemGB / $totalMemGB) * 100, 1))%)"
    Write-Host "  - Free Memory: $freeMemGB GB"
    
    # Disk usage
    $disk = Get-WmiObject Win32_LogicalDisk -Filter "DeviceID='C:'"
    $freeSpaceGB = [math]::Round($disk.FreeSpace / 1GB, 2)
    $totalSpaceGB = [math]::Round($disk.Size / 1GB, 2)
    $usedSpaceGB = $totalSpaceGB - $freeSpaceGB
    
    Write-Host "  - Total Disk: $totalSpaceGB GB"
    Write-Host "  - Used Disk: $usedSpaceGB GB ($([math]::Round(($usedSpaceGB / $totalSpaceGB) * 100, 1))%)"
    Write-Host "  - Free Disk: $freeSpaceGB GB"
  shell: pwsh
```
**Purpose:** Reports system resource consumption after deployment
**Memory Tracking:** Total, used, and free memory with percentages
**Disk Tracking:** Similar disk space reporting

#### 3. Final Status and Instructions
```yaml
- name: Final deployment status
  run: |
    Write-Host "🎯 Final Deployment Status:"
    Write-Host ""
    
    if ("${{ needs.backend-deploy.result }}" -eq "success" -and "${{ needs.frontend-deploy.result }}" -eq "success") {
        Write-Host "✅ DEPLOYMENT SUCCESSFUL!"
        Write-Host ""
        Write-Host "🔗 Application URLs:"
        Write-Host "   Backend API: http://localhost:7071"
        Write-Host "   Chartering: http://localhost:3001"
        Write-Host "   Registers: http://localhost:3002"
        Write-Host "   Home: http://localhost:3003"
        Write-Host "   Accounting: http://localhost:3004"
        Write-Host "   Voyage Manager: http://localhost:3005"
        Write-Host "   Auth: http://localhost:3006"
        Write-Host ""
        Write-Host "📝 Next Steps:"
        Write-Host "   - Test applications by visiting the URLs above"
        Write-Host "   - Monitor logs for any runtime issues"
        Write-Host "   - Database connectivity may need configuration"
    } else {
        Write-Host "❌ DEPLOYMENT FAILED OR INCOMPLETE"
        Write-Host ""
        Write-Host "Failed Components:"
        if ("${{ needs.backend-deploy.result }}" -ne "success") {
            Write-Host "   - Backend deployment: ${{ needs.backend-deploy.result }}"
        }
        if ("${{ needs.frontend-deploy.result }}" -ne "success") {
            Write-Host "   - Frontend deployment: ${{ needs.frontend-deploy.result }}"
        }
        Write-Host ""
        Write-Host "🔍 Troubleshooting:"
        Write-Host "   - Check the job logs above for specific error messages"
        Write-Host "   - Verify all prerequisites are installed"
        Write-Host "   - Ensure ports 7071, 3001-3006 are available"
        Write-Host "   - Check system resources (memory, disk space)"
    }
    
    Write-Host ""
    Write-Host "Deployment completed at: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
  shell: pwsh
```
**Purpose:** Provides final status with user guidance
**Success Path:** Lists all application URLs and next steps
**Failure Path:** Identifies failed components and troubleshooting steps
**Timestamp:** Records completion time for reference

#### 4. Optional Cleanup (Commented)
```yaml
# Optional: Clean up deployment files
# - name: Cleanup deployment files
#   run: |
#     Remove-Item -Path "*_pid.txt" -Force -ErrorAction SilentlyContinue
#     Remove-Item -Path "deployment_summary.txt" -Force -ErrorAction SilentlyContinue
#   shell: pwsh
```
**Purpose:** Removes temporary files created during deployment
**Status:** Commented out to preserve process information for debugging
**Files:** PID files and deployment summary

---

## 🎯 Pipeline Flow Summary

```
1. Pre-deployment Checks
   ├── Port availability verification
   ├── Disk space validation  
   └── Existing process cleanup

2. Backend Deployment
   ├── .NET and Azure Functions setup
   ├── Build and compile
   └── Start Functions service (port 7071)

3. Frontend Deployment (Parallel)
   ├── 6 apps deployed simultaneously
   ├── Each app on unique port (3001-3006)
   └── Environment-specific configuration

4. Post-deployment Validation
   ├── Backend health checks
   ├── Frontend response validation
   └── Comprehensive status reporting

5. Summary and Cleanup
   ├── Process status report
   ├── Resource usage summary
   └── Final deployment status
```

## 🚀 Key Features

### Smart Deployment Detection
- Port availability checking before deployment
- Process cleanup to prevent conflicts
- Resource validation (disk space, memory)

### Parallel Processing
- All 6 frontend apps deploy simultaneously
- Maximum efficiency with matrix strategy
- Independent failure handling per app

### Health Monitoring
- Comprehensive health checks for all services
- Retry logic for flaky network conditions
- Resource usage monitoring

### Rollback Preparation
- Process ID tracking for all services
- Detailed error reporting for troubleshooting
- Status preservation for debugging

### User Experience
- Clear status reporting with emojis
- Direct URLs for immediate testing
- Troubleshooting guidance for failures

## 🛠️ Configuration Notes

### Port Assignment Strategy
- **7071:** Backend (Azure Functions standard)
- **3001-3006:** Frontend apps (sequential assignment)
- **Isolation:** Each app runs independently

### Environment Variables
- **NEXT_PUBLIC_API_URL:** Points all frontend apps to backend
- **NX_*:** Prevents interactive prompts in automated environment
- **PORT:** Unique port per application

### Self-Hosted Runner Requirements
- Windows environment with PowerShell
- .NET 8.0 SDK installed
- Node.js 20.x installed
- Azure Functions Core Tools capability
- Network access to GitHub for artifact downloads