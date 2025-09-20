// JWT Token Management for Operations App

export interface TokenData {
  shortToken?: string;
  longToken?: string;
  username: string;
  expiresAt?: number; // Add expiration timestamp
}

export interface CreateShortTokenResponse {
  shortToken: string;
  username: string;
}

export interface ExchangeShortTokenRequest {
  shortToken: string;
}

export interface ExchangeShortTokenResponse {
  longToken: string;
}

class TokenManager {
  private static instance: TokenManager | null = null;
  private tokenData: TokenData | null = null;
  private expirationCheckInterval: NodeJS.Timeout | null = null;
  private initialized = false;

  private constructor() {
    // Don't initialize anything in constructor to avoid SSR issues
  }

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  // Initialize the TokenManager (call this when needed)
  private initialize(): void {
    if (this.initialized) return;
    
    // Only start expiration checking in browser environment
    if (this.isBrowser()) {
      this.startExpirationCheck();
    }
    
    this.initialized = true;
  }

  // Helper method to check if we're in browser environment
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  // Helper method to set a cookie
  private setCookie(name: string, value: string, days: number = 1): void {
    if (!this.isBrowser()) return;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    const expiresString = expires.toUTCString();
    
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expiresString}; path=/; SameSite=Strict`;
  }

  // Helper method to get a cookie
  private getCookie(name: string): string | null {
    if (!this.isBrowser()) return null;
    
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  }

  // Helper method to delete a cookie
  private deleteCookie(name: string): void {
    if (!this.isBrowser()) return;
    
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  // Store token data after login
  setTokenData(data: TokenData): void {
    // Initialize if not already done
    this.initialize();
    
    // Validate required data
    if (!data.username || data.username === 'undefined' || data.username.trim() === '') {
      throw new Error('Valid username is required');
    }
    
    if (!data.longToken || data.longToken.trim() === '') {
      throw new Error('Valid long token is required');
    }
    
    // Add expiration time (24 hours from now for long tokens)
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
    
    this.tokenData = {
      ...data,
      expiresAt
    };
    
    // Store in cookies (24 hours expiration)
    if (this.isBrowser()) {
      this.setCookie('longToken', data.longToken, 1);
      this.setCookie('username', data.username, 1);
      this.setCookie('expiresAt', expiresAt.toString(), 1);
    }
    
    // Restart expiration checking only in browser
    if (this.isBrowser()) {
      this.startExpirationCheck();
    }
  }

  // Set short token separately (for operations registration)
  setShortToken(shortToken: string): void {
    if (this.tokenData) {
      this.tokenData.shortToken = shortToken;
      // Store short token in cookie (shorter expiration - 10 minutes)
      if (this.isBrowser()) {
        this.setCookie('shortToken', shortToken, 1/144); // 10 minutes
      }
    }
  }

    // Get stored token data
  getTokenData(): TokenData | null {
    // Initialize if not already done
    this.initialize();
    
    if (!this.tokenData && this.isBrowser()) {
      try {
        const longToken = this.getCookie('longToken');
        const username = this.getCookie('username');
        const expiresAtStr = this.getCookie('expiresAt');
        const shortToken = this.getCookie('shortToken');
        
        // Validate username - don't accept 'undefined' or empty values
        const isValidUsername = username && 
                               username !== 'undefined' && 
                               username.trim() !== '' &&
                               username !== 'null';
        
        if (longToken && isValidUsername) {
          const expiresAt = expiresAtStr ? parseInt(expiresAtStr) : undefined;
          
          this.tokenData = {
            longToken,
            username,
            expiresAt,
            shortToken: shortToken || undefined
          };
        } else {
          // Clear invalid cookies
          this.clearTokens();
        }
      } catch (error) {
        // Clear corrupted data
        this.clearTokens();
      }
    }
    return this.tokenData;
  }

  // Get long token for API requests
  getLongToken(): string | null {
    const data = this.getTokenData();
    return data?.longToken || null;
  }

  // Get short token for operations registration
  getShortToken(): string | null {
    const data = this.getTokenData();
    return data?.shortToken || null;
  }

  // Get username
  getUsername(): string | null {
    const data = this.getTokenData();
    return data?.username || null;
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    const data = this.getTokenData();
    if (!data?.expiresAt) return true;
    
    return Date.now() >= data.expiresAt;
  }

  // Clear all tokens (logout)
  clearTokens(): void {
    this.tokenData = null;
    if (this.isBrowser()) {
      this.deleteCookie('longToken');
      this.deleteCookie('shortToken');
      this.deleteCookie('username');
      this.deleteCookie('expiresAt');
    }
    this.stopExpirationCheck();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    // Check if token exists, is not expired, and username exists
    const longToken = this.getLongToken();
    const username = this.getUsername();
    return !!longToken && !this.isTokenExpired() && !!username;
  }

  // Get authorization header for API requests
  getAuthHeader(): { Authorization: string } | null {
    const longToken = this.getLongToken();
    if (!longToken || this.isTokenExpired()) {
      return null;
    }
    
    return {
      Authorization: `Bearer ${longToken}`
    };
  }

  // Start checking for token expiration
  private startExpirationCheck(): void {
    // Only run in browser environment
    if (!this.isBrowser()) return;
    
    // Clear any existing interval
    this.stopExpirationCheck();
    
    // Check every minute for token expiration
    this.expirationCheckInterval = setInterval(() => {
      if (this.isTokenExpired()) {
        console.log('Token expired, clearing authentication');
        this.clearTokens();
        
        // Redirect to login if in browser environment
        if (typeof window !== 'undefined') {
          // Only redirect if not already on login page
          if (window.location.pathname !== '/login') {
            const charteringUrl = process.env.NEXT_PUBLIC_CHARTERING_URL ;
            window.location.href = `${charteringUrl}/login`;        return; // Stop execution since we're redirecting
          }
        }
      }
    }, 60000); // Check every minute
  }

  // Stop checking for token expiration
  private stopExpirationCheck(): void {
    if (this.expirationCheckInterval) {
      clearInterval(this.expirationCheckInterval);
      this.expirationCheckInterval = null;
    }
  }

  // Cleanup method for when TokenManager is destroyed
  destroy(): void {
    this.stopExpirationCheck();
  }
}

// Export the TokenManager instance
export const tokenManager = TokenManager.getInstance();
