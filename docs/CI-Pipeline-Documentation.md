# 📖 CI Pipeline Documentation (`ci.yml`)

This document provides line-by-line documentation for the Continuous Integration (CI) pipeline of the Shipnet 2.0 project.

## 🎯 Pipeline Overview

The CI pipeline is responsible for:
- Building and testing the .NET backend (Azure Functions)
- Building and testing all 6 Next.js frontend applications
- Running security and quality checks
- Performing integration tests with PostgreSQL
- Generating comprehensive build reports

---

## 📋 Pipeline Configuration

### Workflow Name and Triggers

```yaml
name: CI Pipeline - Shipnet 2.0
```
**Purpose:** Defines the display name for this workflow in GitHub Actions UI

```yaml
on:
  push:
    branches: [ main, develop, feature/* ]
  pull_request:
    branches: [ main, develop ]
```
**Purpose:** 
- **push triggers:** Runs on code pushes to main, develop, and any feature branches
- **pull_request triggers:** Runs on PRs targeting main or develop branches
- **Why these branches:** Ensures all code changes are validated before integration

### Environment Variables

```yaml
env:
  DOTNET_VERSION: '8.0.x'
  NODE_VERSION: '20.x'
  NX_CONSOLE_NO_INSTALL_PROMPT: 'true'
  NX_REJECT_UNKNOWN_LOCAL_CACHE: '0'
```

**Variable Breakdown:**
- **DOTNET_VERSION:** Specifies .NET 8.0 for backend Azure Functions
- **NODE_VERSION:** Specifies Node.js 20.x for frontend builds (LTS version)
- **NX_CONSOLE_NO_INSTALL_PROMPT:** Prevents Nx from prompting to install Nx Console (automation-friendly)
- **NX_REJECT_UNKNOWN_LOCAL_CACHE:** Allows Nx to use cache even if it can't verify it (CI environment)

---

## 🔧 Job 1: Backend CI (.NET Functions)

### Job Configuration
```yaml
backend-ci:
    name: Backend CI - .NET Functions
    runs-on: ubuntu-latest
```
**Purpose:** Uses GitHub-hosted Ubuntu runner for consistent, clean environment

### Step-by-Step Breakdown

#### 1. Repository Checkout
```yaml
- name: Checkout repository
  uses: actions/checkout@v4
```
**Purpose:** Downloads the source code to the runner
**Why v4:** Latest stable version with better security and performance

#### 2. .NET SDK Setup
```yaml
- name: Setup .NET
  uses: actions/setup-dotnet@v4
  with:
    dotnet-version: ${{ env.DOTNET_VERSION }}
```
**Purpose:** Installs .NET 8.0 SDK on the runner
**Variable Reference:** Uses environment variable for version consistency

#### 3. Package Caching
```yaml
- name: Cache .NET packages
  uses: actions/cache@v3
  with:
    path: ~/.nuget/packages
    key: ${{ runner.os }}-nuget-${{ hashFiles('**/packages.lock.json') }}
    restore-keys: |
      ${{ runner.os }}-nuget-
```
**Purpose:** Caches NuGet packages to speed up subsequent builds
**Cache Key Logic:**
- Primary: OS + hash of packages.lock.json (exact dependency match)
- Fallback: OS + "nuget-" prefix (partial match for similar dependencies)

#### 4. Dependency Restoration
```yaml
- name: Restore dependencies
  run: dotnet restore
  working-directory: ./backend/ShipnetFunctionApp
```
**Purpose:** Downloads and installs all NuGet package dependencies
**Working Directory:** Targets the specific Function App project

#### 5. Build Process
```yaml
- name: Build backend
  run: dotnet build --no-restore --configuration Release
  working-directory: ./backend/ShipnetFunctionApp
```
**Purpose:** Compiles the .NET application
**Flags:**
- `--no-restore`: Skips restore (already done in previous step)
- `--configuration Release`: Optimized build for production

#### 6. Test Execution
```yaml
- name: Run backend tests
  run: dotnet test --no-build --verbosity normal --configuration Release --collect:"XPlat Code Coverage"
  working-directory: ./backend/ShipnetFunctionApp
  continue-on-error: true
```
**Purpose:** Executes unit and integration tests
**Flags:**
- `--no-build`: Uses already compiled code
- `--verbosity normal`: Balanced output detail
- `--collect:"XPlat Code Coverage"`: Generates code coverage reports
- `continue-on-error: true`: Pipeline continues even if tests fail (for reporting)

#### 7. Artifact Upload
```yaml
- name: Upload backend artifacts
  uses: actions/upload-artifact@v3
  with:
    name: backend-build
    path: |
      backend/ShipnetFunctionApp/bin/Release/
      backend/ShipnetFunctionApp/obj/Release/
    retention-days: 1
```
**Purpose:** Stores build outputs for the CD pipeline
**Paths:** Both binary and object files for complete deployment package
**Retention:** 1 day (short-lived for CI/CD pipeline use)

---

## 🌐 Job 2: Frontend CI (Next.js Apps)

### Job Configuration
```yaml
frontend-ci:
    name: Frontend CI - Next.js Apps
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        app: [chartering, registers, home, accounting, voyagemanager, auth]
```
**Purpose:** Uses matrix strategy to build all 6 apps in parallel
**App List:** All current Shipnet 2.0 frontend applications

### Step-by-Step Breakdown

#### 1. Repository Checkout
```yaml
- name: Checkout repository
  uses: actions/checkout@v4
```
**Purpose:** Same as backend - gets the source code

#### 2. Node.js Setup with Caching
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: ${{ env.NODE_VERSION }}
    cache: 'npm'
    cache-dependency-path: |
      package-lock.json
      frontend/package-lock.json
```
**Purpose:** Installs Node.js 20.x with npm caching
**Cache Paths:** Both root and frontend package-lock.json files
**Why Both:** Project has dual package.json structure (root + frontend workspace)

#### 3. Root Dependencies Installation
```yaml
- name: Install root dependencies
  run: npm ci
```
**Purpose:** Installs root-level dependencies
**npm ci vs npm install:** `ci` is faster, deterministic, and designed for CI environments

#### 4. Frontend Workspace Dependencies
```yaml
- name: Install frontend workspace dependencies
  run: npm ci
  working-directory: ./frontend
```
**Purpose:** Installs frontend workspace dependencies (Nx, shared packages)
**Directory:** Frontend workspace root

#### 5. Linting (with Smart Detection)
```yaml
- name: Lint ${{ matrix.app }} app
  run: |
    # Check if linting configuration exists for the app
    if npx nx show project ${{ matrix.app }} | grep -q "lint"; then
      npx nx lint ${{ matrix.app }}
    else
      echo "No lint configuration found for ${{ matrix.app }}, skipping..."
    fi
  working-directory: ./frontend
  continue-on-error: true
```
**Purpose:** Runs ESLint on the specific app
**Smart Detection:** Checks if lint target exists before running
**Why Skip:** Some apps might not have linting configured yet
**Continue on Error:** Prevents pipeline failure from linting issues

#### 6. Build Process
```yaml
- name: Build ${{ matrix.app }} app
  run: npx nx build ${{ matrix.app }} --configuration=production
  working-directory: ./frontend
```
**Purpose:** Builds the Next.js app for production
**Nx Command:** Uses Nx build system for optimized builds
**Configuration:** Production mode for optimized output

#### 7. Test Execution (with Detection)
```yaml
- name: Run ${{ matrix.app }} tests
  run: |
    # Run specific tests for the app if they exist
    if [ -d "apps/${{ matrix.app }}/__tests__" ] || [ -d "apps/${{ matrix.app }}/src/__tests__" ]; then
      npm run test:${{ matrix.app }}
    else
      npx nx test ${{ matrix.app }} --passWithNoTests --watchAll=false
    fi
  working-directory: ./frontend
  continue-on-error: true
```
**Purpose:** Runs tests for the specific app
**Test Detection:** Checks for test directories first
**Fallback:** Uses Nx test with `--passWithNoTests` if no tests exist
**Flags:**
- `--passWithNoTests`: Doesn't fail if no tests found
- `--watchAll=false`: Runs once (not in watch mode)

#### 8. Artifact Upload
```yaml
- name: Upload ${{ matrix.app }} build artifacts
  uses: actions/upload-artifact@v3
  with:
    name: frontend-${{ matrix.app }}-build
    path: |
      frontend/apps/${{ matrix.app }}/.next/
      frontend/apps/${{ matrix.app }}/out/
      frontend/apps/${{ matrix.app }}/dist/
    retention-days: 1
```
**Purpose:** Stores build outputs for CD pipeline
**Multiple Paths:** Different Next.js output formats (.next, out, dist)
**Naming:** Unique artifact name per app

---

## 🔒 Job 3: Security and Quality Checks

### Job Configuration
```yaml
security-quality:
    name: Security & Quality Checks
    runs-on: ubuntu-latest
    needs: [backend-ci, frontend-ci]
```
**Purpose:** Runs after both backend and frontend builds complete
**Dependencies:** Ensures builds are successful before security checks

### Step-by-Step Breakdown

#### 1. Setup and Dependencies
```yaml
- name: Setup Node.js for security scan
  uses: actions/setup-node@v4
  with:
    node-version: ${{ env.NODE_VERSION }}
```
**Purpose:** Installs Node.js for npm audit commands

#### 2. Dependency Installation (Dual Package Structure)
```yaml
- name: Install root dependencies
  run: npm ci
  
- name: Install frontend dependencies
  run: npm ci
  working-directory: ./frontend
```
**Purpose:** Installs dependencies for both package.json files
**Why Both:** Ensures comprehensive security scanning

#### 3. NPM Security Audit
```yaml
- name: Run npm audit
  run: |
    echo "Running npm audit for root package..."
    npm audit --audit-level=high || true
    echo "Running npm audit for frontend workspace..."
    cd frontend && npm audit --audit-level=high || true
  continue-on-error: true
```
**Purpose:** Scans for known security vulnerabilities
**Audit Level:** Only reports high-severity issues
**|| true:** Prevents command failure from stopping pipeline
**Dual Scan:** Checks both package.json files

#### 4. .NET Security Scan
```yaml
- name: Setup .NET for backend security scan
  uses: actions/setup-dotnet@v4
  with:
    dotnet-version: ${{ env.DOTNET_VERSION }}
    
- name: Run .NET security scan
  run: |
    dotnet list package --outdated
    dotnet list package --vulnerable
  working-directory: ./backend/ShipnetFunctionApp
  continue-on-error: true
```
**Purpose:** Scans .NET packages for outdated and vulnerable packages
**Commands:**
- `--outdated`: Lists packages with newer versions
- `--vulnerable`: Lists packages with known vulnerabilities

---

## 🧪 Job 4: Integration Tests

### Job Configuration
```yaml
integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    needs: [backend-ci, frontend-ci]
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: testpassword
          POSTGRES_USER: testuser
          POSTGRES_DB: shipnet_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
```
**Purpose:** Runs integration tests with real PostgreSQL database
**Service Container:** Provides PostgreSQL 13 for testing
**Health Checks:** Ensures database is ready before tests
**Connection Details:** Configured for test environment

### Step-by-Step Breakdown

#### 1. Setup and Artifact Download
```yaml
- name: Download backend artifacts
  uses: actions/download-artifact@v3
  with:
    name: backend-build
    path: ./backend/ShipnetFunctionApp/
```
**Purpose:** Gets compiled backend from earlier CI job
**Reuse:** Avoids rebuilding for integration tests

#### 2. Database Preparation
```yaml
- name: Setup test database
  run: |
    sudo apt-get update
    sudo apt-get install --yes postgresql-client
    PGPASSWORD=testpassword psql -h localhost -U testuser -d shipnet_test -c "CREATE SCHEMA IF NOT EXISTS public;"
  env:
    PGPASSWORD: testpassword
```
**Purpose:** Installs PostgreSQL client and prepares test database
**Schema Creation:** Ensures public schema exists
**Environment Variable:** Sets password for psql connection

#### 3. Integration Test Execution
```yaml
- name: Run integration tests
  run: dotnet test --configuration Release --logger trx --results-directory TestResults
  working-directory: ./backend/ShipnetFunctionApp
  env:
    ConnectionStrings__DefaultConnection: "Host=localhost;Database=shipnet_test;Username=testuser;Password=testpassword"
  continue-on-error: true
```
**Purpose:** Runs integration tests with real database
**Logger:** Generates TRX format test results
**Connection String:** Points to test PostgreSQL container
**Environment Override:** Uses test database instead of production

---

## 📊 Job 5: Build Summary and Notifications

### Job Configuration
```yaml
build-summary:
    name: Build Summary
    runs-on: ubuntu-latest
    needs: [backend-ci, frontend-ci, security-quality, integration-tests]
    if: always()
```
**Purpose:** Always runs regardless of previous job outcomes
**Dependencies:** Waits for all other jobs to complete

### Step-by-Step Breakdown

#### 1. Build Summary Creation
```yaml
- name: Create build summary
  run: |
    echo "# 🚀 Shipnet 2.0 CI Pipeline Results" >> $GITHUB_STEP_SUMMARY
    echo "" >> $GITHUB_STEP_SUMMARY
    echo "## Backend Status" >> $GITHUB_STEP_SUMMARY
    echo "- .NET Functions Build: ${{ needs.backend-ci.result }}" >> $GITHUB_STEP_SUMMARY
    # ... more summary content
```
**Purpose:** Creates GitHub Actions step summary with results
**Format:** Markdown for rich display
**Variables:** Uses job result variables for status reporting

#### 2. Failure Notification
```yaml
- name: Notify on failure
  if: ${{ needs.backend-ci.result == 'failure' || needs.frontend-ci.result == 'failure' }}
  run: |
    echo "❌ CI Pipeline Failed!"
    echo "Please check the logs above for detailed error information."
    exit 1
```
**Purpose:** Fails the entire pipeline if critical jobs failed
**Condition:** Checks backend or frontend build failures
**Exit Code:** Returns 1 to indicate failure

#### 3. Success Notification
```yaml
- name: Success notification
  if: ${{ needs.backend-ci.result == 'success' && needs.frontend-ci.result == 'success' }}
  run: |
    echo "✅ CI Pipeline Completed Successfully!"
    echo "All builds passed and artifacts are ready for deployment."
```
**Purpose:** Confirms successful completion
**Condition:** Both backend and frontend must succeed

---

## 🎯 Pipeline Flow Summary

1. **Parallel Execution:** Backend and Frontend CI jobs run simultaneously
2. **Dependency Chain:** Security and Integration tests wait for builds
3. **Matrix Strategy:** 6 frontend apps built in parallel
4. **Artifact Management:** Build outputs stored for CD pipeline
5. **Comprehensive Reporting:** All results aggregated in final summary
6. **Failure Handling:** Pipeline fails if critical builds fail

## 🚀 Best Practices Implemented

- **Caching:** Reduces build times with package caching
- **Parallel Processing:** Maximum efficiency with matrix and parallel jobs
- **Error Handling:** Continue-on-error for non-critical steps
- **Security:** Automated vulnerability scanning
- **Testing:** Multiple test types (unit, integration)
- **Reporting:** Comprehensive status reporting
- **Artifact Management:** Efficient storage and retrieval