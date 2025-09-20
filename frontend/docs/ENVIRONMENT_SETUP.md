# Environment Setup Guide

## 🚀 Quick Start

1. **Copy the environment template below**
2. **Create `.env.local` in your project root**
3. **Paste and modify the values**

## 📁 Environment File Locations

Create these files in your project:

```
frontend/
├── .env.local                    # Local development
├── .env.staging                 # Staging environment  
├── .env.production              # Production environment
├── apps/chartering/.env.local   # Chartering app specific
├── apps/registers/.env.local    # Registers app specific
├── apps/auth/.env.local         # Auth app specific
└── apps/home/.env.local         # Home app specific
```

## 🔧 Environment File Templates

### 1. Root `.env.local` (Development)

```bash
# =============================================================================
# SHIPNET 2.0 - LOCAL DEVELOPMENT ENVIRONMENT
# =============================================================================

# App URLs
NEXT_PUBLIC_AUTH_URL=http://localhost:3002
NEXT_PUBLIC_OPERATIONS_URL=http://localhost:3000
NEXT_PUBLIC_REGISTERS_URL=http://localhost:3001
NEXT_PUBLIC_ACCOUNTING_URL=http://localhost:3003

# API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:7071

# App Ports (optional)
NEXT_PUBLIC_AUTH_PORT=3002
NEXT_PUBLIC_OPERATIONS_PORT=3000
NEXT_PUBLIC_REGISTERS_PORT=3001
NEXT_PUBLIC_ACCOUNTING_PORT=3003
```

### 2. Root `.env.staging`

```bash
# =============================================================================
# SHIPNET 2.0 - STAGING ENVIRONMENT
# =============================================================================

# App URLs
NEXT_PUBLIC_AUTH_URL=https://auth-staging.yourdomain.com
NEXT_PUBLIC_OPERATIONS_URL=https://operations-staging.yourdomain.com
NEXT_PUBLIC_REGISTERS_URL=https://registers-staging.yourdomain.com
NEXT_PUBLIC_ACCOUNTING_URL=https://accounting-staging.yourdomain.com

# API Base URL
NEXT_PUBLIC_API_BASE_URL=https://api-staging.yourdomain.com

# App Ports (optional)
NEXT_PUBLIC_AUTH_PORT=443
NEXT_PUBLIC_OPERATIONS_PORT=443
NEXT_PUBLIC_REGISTERS_PORT=443
NEXT_PUBLIC_ACCOUNTING_PORT=443
```

### 3. Root `.env.production`

```bash
# =============================================================================
# SHIPNET 2.0 - PRODUCTION ENVIRONMENT
# =============================================================================

# App URLs
NEXT_PUBLIC_AUTH_URL=https://auth.yourdomain.com
NEXT_PUBLIC_OPERATIONS_URL=https://operations.yourdomain.com
NEXT_PUBLIC_REGISTERS_URL=https://registers.yourdomain.com
NEXT_PUBLIC_ACCOUNTING_URL=https://accounting.yourdomain.com

# API Base URL
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com

# App Ports (optional)
NEXT_PUBLIC_AUTH_PORT=443
NEXT_PUBLIC_OPERATIONS_PORT=443
NEXT_PUBLIC_REGISTERS_PORT=443
NEXT_PUBLIC_ACCOUNTING_PORT=443
```

## 🎯 How to Create Environment Files

### Option 1: Manual Creation

1. **Navigate to your project root:**
   ```bash
   cd D:\Git\Shipnet-2.0\frontend
   ```

2. **Create `.env.local`:**
   ```bash
   # Windows PowerShell
   New-Item -Path ".env.local" -ItemType File
   
   # Or manually create in VS Code/File Explorer
   ```

3. **Copy the template content above and paste it**

### Option 2: Using Command Line

```bash
# Windows PowerShell
echo "# SHIPNET 2.0 - LOCAL DEVELOPMENT" > .env.local
echo "NEXT_PUBLIC_AUTH_URL=http://localhost:3002" >> .env.local
echo "NEXT_PUBLIC_OPERATIONS_URL=http://localhost:3000" >> .env.local
echo "NEXT_PUBLIC_REGISTERS_URL=http://localhost:3001" >> .env.local
echo "NEXT_PUBLIC_ACCOUNTING_URL=http://localhost:3003" >> .env.local
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:7071" >> .env.local
```

### Option 3: Copy from Template

1. **Create a file called `env-template.txt`**
2. **Copy the template content above**
3. **Rename it to `.env.local`**

## 🔍 Verification

After creating your `.env.local`, verify it works:

1. **Restart your development server**
2. **Check browser console for any errors**
3. **Verify URLs are using environment variables**

## 📋 Environment Variables Summary

| Variable | Purpose | Default Value |
|----------|---------|---------------|
| `NEXT_PUBLIC_AUTH_URL` | Auth app URL | `http://localhost:3002` |
| `NEXT_PUBLIC_OPERATIONS_URL` | Operations app URL | `http://localhost:3000` |
| `NEXT_PUBLIC_REGISTERS_URL` | Registers app URL | `http://localhost:3001` |
| `NEXT_PUBLIC_ACCOUNTING_URL` | Accounting app URL | `http://localhost:3003` |
| `NEXT_PUBLIC_API_BASE_URL` | API base URL | `http://localhost:7071` |

## ⚠️ Important Notes

- **All variables MUST start with `NEXT_PUBLIC_`** to be accessible in the browser
- **Environment files are gitignored** by default for security
- **Restart your dev server** after creating/modifying environment files
- **Fallback values** are built into the code for development

## 🚨 Troubleshooting

### "Environment variable not found"
- Check that the variable name starts with `NEXT_PUBLIC_`
- Restart your development server
- Verify the `.env.local` file is in the correct location

### "Still using localhost URLs"
- Ensure environment variables are set correctly
- Check for typos in variable names
- Verify the file is saved with `.env.local` extension

### "Changes not taking effect"
- Restart your Next.js development server
- Clear browser cache
- Check that the file is saved in the correct location

## 🎉 Success!

Once you've created your `.env.local` file, your app will be fully environment-aware and ready for deployment to any domain!
