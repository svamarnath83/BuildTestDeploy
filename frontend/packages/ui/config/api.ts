export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7071',
  ENDPOINTS: {
    SHIPS: '/api/vessels',
    PORTS: '/api/ports',
    GRADES: '/api/grades',
    VESSEL_TYPES: '/api/vesseltypes',
    COUNTRIES: '/api/country',
    AGENTS: '/api/agents',
    VOYAGES: '/api/voyages',
    BOOKINGS: '/api/bookings',
    AREAS: '/api/area',
    COMMODITIES: '/api/commodities',
    UNITS: '/api/units',
    CURRENCIES: '/api/currencies',
    ESTIMATES: '/api/estimates',
    THIDPARTY: '/api/thirdparty',
    AUTH: '/api/auth',
    ACTIVITY: '/api/activitylogs',
    AUDIT: '/api/auditlogs',
    // Add the missing accounts endpoints based on your backend routes
    ACCOUNTS: '/api/accounts',
    ACCOUNT_GROUPS: '/api/account-groups',
  },
  TIMEOUT: 10000, // 10 seconds
} as const;

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};