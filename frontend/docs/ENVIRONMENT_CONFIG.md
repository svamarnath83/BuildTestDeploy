# Environment Configuration

This document describes the environment variables needed to configure the app URLs and API endpoints.

## Required Environment Variables

### App URLs
```bash
# Development (default)
NEXT_PUBLIC_AUTH_URL=http://localhost:3002
NEXT_PUBLIC_OPERATIONS_URL=http://localhost:3000
NEXT_PUBLIC_REGISTERS_URL=http://localhost:3001
NEXT_PUBLIC_ACCOUNTING_URL=http://localhost:3003

# API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:7071
```

### Optional App Ports
```bash
NEXT_PUBLIC_AUTH_PORT=3002
NEXT_PUBLIC_OPERATIONS_PORT=3000
NEXT_PUBLIC_REGISTERS_PORT=3001
NEXT_PUBLIC_ACCOUNTING_PORT=3003
```

## Environment Examples

### Development
```bash
NEXT_PUBLIC_AUTH_URL=http://localhost:3002
NEXT_PUBLIC_OPERATIONS_URL=http://localhost:3000
NEXT_PUBLIC_REGISTERS_URL=http://localhost:3001
NEXT_PUBLIC_ACCOUNTING_URL=http://localhost:3003
NEXT_PUBLIC_API_BASE_URL=http://localhost:7071
```

### Staging
```bash
NEXT_PUBLIC_AUTH_URL=https://auth-staging.yourdomain.com
NEXT_PUBLIC_OPERATIONS_URL=https://operations-staging.yourdomain.com
NEXT_PUBLIC_REGISTERS_URL=https://registers-staging.yourdomain.com
NEXT_PUBLIC_ACCOUNTING_URL=https://accounting-staging.yourdomain.com
NEXT_PUBLIC_API_BASE_URL=https://api-staging.yourdomain.com
```

### Production
```bash
NEXT_PUBLIC_AUTH_URL=https://auth.yourdomain.com
NEXT_PUBLIC_OPERATIONS_URL=https://operations.yourdomain.com
NEXT_PUBLIC_REGISTERS_URL=https://registers.yourdomain.com
NEXT_PUBLIC_ACCOUNTING_URL=https://accounting.yourdomain.com
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

## Usage in Code

The environment variables are used in the following files:

- `packages/ui/libs/cacheManager.ts` - App navigation URLs
- `packages/ui/config/api.ts` - API base URL
- `packages/ui/src/components/ui/AppLayout.tsx` - Cross-app navigation URLs
- `apps/home/src/app/page.tsx` - Module navigation URLs
- `apps/auth/app/login/page.tsx` - Post-login redirect URL
- `apps/chartering/src/app/cargo-analysis/libs/distanceServices.ts` - API base URL

## Fallback Values

If environment variables are not set, the system will fall back to localhost URLs for development purposes.

## Security Note

All these variables are prefixed with `NEXT_PUBLIC_` which means they will be exposed to the browser. This is necessary for client-side navigation between apps.
