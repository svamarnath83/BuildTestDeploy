'use client';

import { useEffect, useRef } from 'react';
import { initializeCacheFromQueryString } from '../../../libs/cacheManager';
import { RegistersAuthService } from '../../../libs/registers/authService';
import { tokenManager } from '../../../libs/auth/tokenManager';

interface SimpleCacheProps {
  appName?: string;
  autoInit?: boolean;
}

// Global state to coordinate token exchange across all SimpleCache instances
let isExchangingToken = false;
let exchangePromise: Promise<void> | null = null;
const processedTokens = new Set<string>();

// Cleanup old processed tokens periodically to prevent memory leaks
const cleanupProcessedTokens = () => {
  if (processedTokens.size > 10) {
    const tokens = Array.from(processedTokens);
    processedTokens.clear();
    // Keep only the last 5 tokens
    tokens.slice(-5).forEach(token => processedTokens.add(token));
    console.log(`🧹 Cleaned up processed tokens, kept last 5`);
  }
};

// Global token exchange function to prevent multiple API calls
const exchangeTokenGlobally = async (shortToken: string, username?: string): Promise<void> => {
  try {
    console.log(`🔄 Starting token exchange for ${shortToken.substring(0, 8)}...`);
    const { longToken, username: responseUsername } = await RegistersAuthService.exchangeShortToken(shortToken);
    
    // Use username from URL if provided, otherwise use response username
    const finalUsername = username || responseUsername;
    
    // Store the long token and user data
    tokenManager.setTokenData({
      longToken,
      username: finalUsername,
    });
    
    // Clean URL
    if (typeof window !== 'undefined') {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete('shortToken');
      currentUrl.searchParams.delete('username');
      currentUrl.searchParams.delete('from');
      window.history.replaceState({}, document.title, currentUrl.pathname);
    }
    
    console.log(`✅ Token exchange completed successfully`);
  } catch (error) {
    console.error('❌ Token exchange failed:', error);
    throw error;
  }
};

export function SimpleCache({ appName, autoInit = true }: SimpleCacheProps) {
  const hasInitialized = useRef(false);

  useEffect(() => {
    const init = async () => {
      // Prevent multiple initializations in same component
      if (!autoInit || hasInitialized.current) return;
      hasInitialized.current = true;

      const detectedAppName = appName || 'registers';
      console.log(`🚀 SimpleCache initializing for ${detectedAppName}`);

      // Exchange short token if present
      const params = new URLSearchParams(window.location.search);
      const shortToken = params.get('shortToken');
      const username = params.get('username');
      const fromApp = params.get('from');
      
      if (shortToken) {
        // Check if token already processed
        if (processedTokens.has(shortToken)) {
          console.log(`⏭️  Token ${shortToken.substring(0, 8)}... already processed, skipping`);
          return;
        }

        // If already exchanging, wait for completion
        if (isExchangingToken && exchangePromise) {
          try {
            console.log(`⏳ Token exchange in progress, waiting...`);
            await exchangePromise;
            console.log(`✅ Token exchange completed by another instance`);
          } catch (e) {
            console.error('❌ Previous token exchange failed:', e);
          }
        } else if (!isExchangingToken) {
          // Start new exchange
          isExchangingToken = true;
          exchangePromise = exchangeTokenGlobally(shortToken, username || undefined);
          
          try {
            await exchangePromise;
            processedTokens.add(shortToken);
            cleanupProcessedTokens();
          } catch (e) {
            console.error('❌ Failed to exchange short token:', e);
          } finally {
            isExchangingToken = false;
            exchangePromise = null;
          }
        }
      }

      // Initialize cache
      initializeCacheFromQueryString(detectedAppName);
    };

    init();
  }, [appName, autoInit]);

  // This component doesn't render anything
  return null;
}
