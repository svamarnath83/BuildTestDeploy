// Centralized cache manager for all microfrontends
import { createUserSession, getCurrentUserSession, useCacheStore } from './cache';
import { CharteringAuthService } from './chartering/charteringAuthService';
import { tokenManager } from './auth/tokenManager';

// App configuration with environment variables
const APP_CONFIG = {
  auth: { 
    port: process.env.NEXT_PUBLIC_AUTH_PORT || '3002', 
    name: 'Auth',
    url: process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3002'
  },
  chartering: { 
    port: process.env.NEXT_PUBLIC_CHARTERING_PORT || '3000', 
    name: 'Chartering',
    url: process.env.NEXT_PUBLIC_CHARTERING_URL || 'http://localhost:3000'
  },
  registers: { 
    port: process.env.NEXT_PUBLIC_REGISTERS_PORT || '3001', 
    name: 'Registers',
    url: process.env.NEXT_PUBLIC_REGISTERS_URL || 'http://localhost:3001'
  },
  accounting: { 
    port: process.env.NEXT_PUBLIC_ACCOUNTING_PORT || '3003', 
    name: 'Accounting',
    url: process.env.NEXT_PUBLIC_ACCOUNTING_URL || 'http://localhost:3003'
  }
};

// Initialize cache from query string for any app
export const initializeCacheFromQueryString = (appName: string): void => {
  if (typeof window === 'undefined') return;
  
  const urlParams = new URLSearchParams(window.location.search);
  const fromApp = urlParams.get('from');
  const shortToken = urlParams.get('shortToken');
  
  if (shortToken) {
  } else {
  }
};

/// Navigate to another app with optional short token
export const navigateToApp = async (targetApp: keyof typeof APP_CONFIG, sourceApp?: string): Promise<void> => {
  const currentSession = getCurrentUserSession();
  const target = APP_CONFIG[targetApp];

  let shortTokenParam = '';

  // If navigating from Chartering to Registers, create a short token (required for auth)
  if (sourceApp === 'chartering' && targetApp === 'registers') {
    try {
      const { shortToken, username } = await CharteringAuthService.createShortToken();
      
      // Debug logging
      console.log('Creating short token with username:', {
        username,
        usernameType: typeof username,
        isNull: username === null,
        isUndefined: username === undefined,
        isString: typeof username === 'string'
      });
      
      // Ensure username is a valid string
      if (!username || username === 'undefined' || username === 'null') {
        throw new Error('Invalid username received from short token creation');
      }
      
      shortTokenParam = `&shortToken=${encodeURIComponent(shortToken)}&username=${encodeURIComponent(username)}`;
    } catch (e: any) {
      // If short token creation fails due to no auth, redirect to login
      if (e.message.includes('No authorization token available')) {
        const charteringUrl = process.env.NEXT_PUBLIC_CHARTERING_URL ;
        window.location.href = `${charteringUrl}/login`;        return; // Stop execution since we're redirecting
      }
      console.warn('Could not create short token; proceeding without it.');
    }
  }
  // Build navigation URL (no account code stored - only short token for auth)
  const url = targetApp === 'registers' && shortTokenParam
    ? `${target.url}/?from=${sourceApp || 'unknown'}${shortTokenParam}`
    : `${target.url}/?from=${sourceApp || 'unknown'}`;

  window.open(url, '_blank');
};
