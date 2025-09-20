import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// User session interface
export interface UserSession {
  id: string;
  username: string;
  loginTime: number;
  lastActive: number;
}

// Multi-tenant cache store interface
interface CacheStore {
  // Current active session
  activeSession: UserSession | null;
  
  // All user sessions (for multi-tenant support)
  userSessions: Map<string, UserSession>;
  
  // Actions
  setActiveSession: (session: UserSession) => void;
  addUserSession: (session: UserSession) => void;
  removeUserSession: (userId: string) => void;
  clearAllSessions: () => void;
  updateLastActive: (userId: string) => void;
  switchToUser: (userId: string) => void;
  
  // Getters
  hasActiveSession: () => boolean;
  getUserSession: (userId: string) => UserSession | undefined;
  getAllUserSessions: () => UserSession[];
}

// Cookie-based storage implementation
const createCookieStorage = () => {
  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
  
  return {
    getItem: (name: string): string | null => {
      if (!isBrowser) return null;
      
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
    },
    
    setItem: (name: string, value: string): void => {
      if (!isBrowser) return;
      
      // Store cache data in cookie with 7 days expiration
      const expires = new Date();
      expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000));
      const expiresString = expires.toUTCString();
      
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expiresString}; path=/; SameSite=Strict`;
    },
    
    removeItem: (name: string): void => {
      if (!isBrowser) return;
      
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  };
};

// Create the Zustand store with cookie persistence
export const useCacheStore = create<CacheStore>()(
  persist(
    (set, get) => ({
      // State
      activeSession: null,
      userSessions: new Map(),

      // Actions
      setActiveSession: (session: UserSession) => {
        set({ activeSession: session });
        // Also add to userSessions if not already there
        const { userSessions } = get();
        if (!userSessions.has(session.id)) {
          const newUserSessions = new Map(userSessions);
          newUserSessions.set(session.id, session);
          set({ userSessions: newUserSessions });
        }
      },

      addUserSession: (session: UserSession) => {
        const { userSessions } = get();
        const newUserSessions = new Map(userSessions);
        newUserSessions.set(session.id, session);
        set({ userSessions: newUserSessions });
      },

      removeUserSession: (userId: string) => {
        const { userSessions, activeSession } = get();
        const newUserSessions = new Map(userSessions);
        newUserSessions.delete(userId);
        
        // If removing active session, clear it
        let newActiveSession = activeSession;
        if (activeSession?.id === userId) {
          newActiveSession = null;
        }
        
        set({ 
          userSessions: newUserSessions,
          activeSession: newActiveSession
        });
      },

      clearAllSessions: () => {
        set({ 
          activeSession: null,
          userSessions: new Map()
        });
      },

      updateLastActive: (userId: string) => {
        const { userSessions, activeSession } = get();
        const session = userSessions.get(userId);
        if (session) {
          const updatedSession = { ...session, lastActive: Date.now() };
          const newUserSessions = new Map(userSessions);
          newUserSessions.set(userId, updatedSession);
          
          // Update active session if it's the same user
          let newActiveSession = activeSession;
          if (activeSession?.id === userId) {
            newActiveSession = updatedSession;
          }
          
          set({ 
            userSessions: newUserSessions,
            activeSession: newActiveSession
          });
        }
      },

      switchToUser: (userId: string) => {
        const { userSessions } = get();
        const session = userSessions.get(userId);
        if (session) {
          set({ activeSession: session });
        }
      },

      // Getters
      hasActiveSession: () => {
        const { activeSession } = get();
        return activeSession !== null;
      },

      getUserSession: (userId: string) => {
        const { userSessions } = get();
        return userSessions.get(userId);
      },

      getAllUserSessions: () => {
        const { userSessions } = get();
        return Array.from(userSessions.values());
      },
    }),
    {
      name: 'multi-tenant-cache',
      storage: createJSONStorage(() => createCookieStorage()),
      // Convert Map to array for storage, then back to Map on rehydration
      partialize: (state) => ({
        activeSession: state.activeSession,
        userSessions: Array.from(state.userSessions.entries())
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.userSessions && Array.isArray(state.userSessions)) {
          // Convert array back to Map
          state.userSessions = new Map(state.userSessions);
        }
      }
    }
  )
);

// New multi-tenant utility functions
export const createUserSession = (username: string): UserSession => {
  console.log('createUserSession called with:', { username });
  const session: UserSession = {
    id: `${username}-${Date.now()}`,
    username,
    loginTime: Date.now(),
    lastActive: Date.now(),
  };
  console.log('Created session:', session);
  useCacheStore.getState().addUserSession(session);
  // Set as active session immediately after creation
  useCacheStore.getState().setActiveSession(session);
  console.log('Session added to cache and set as active');
  return session;
};

export const switchToUserSession = (userId: string): boolean => {
  const session = useCacheStore.getState().getUserSession(userId);
  if (session) {
    useCacheStore.getState().switchToUser(userId);
    return true;
  }
  return false;
};

export const getCurrentUserSession = (): UserSession | null => {
  return useCacheStore.getState().activeSession;
};

export const getAllUserSessions = (): UserSession[] => {
  return useCacheStore.getState().getAllUserSessions();
};

export const removeUserSession = (userId: string): void => {
  useCacheStore.getState().removeUserSession(userId);
};

export const clearAllSessions = (): void => {
  useCacheStore.getState().clearAllSessions();
};

// Utility to check if cache is ready
export const isCacheReady = (): boolean => {
  try {
    const state = useCacheStore.getState();
    return state !== null;
  } catch {
    return false;
  }
};

// Utility to force cache rehydration
export const rehydrateCache = (): void => {
  try {
    console.log('Forcing cache rehydration...');
    useCacheStore.persist.rehydrate();
  } catch (error) {
    console.error('Failed to rehydrate cache:', error);
  }
};

// Utility to debug cookie state
export const debugCookies = (): void => {
  try {
    if (typeof document === 'undefined') {
      console.log('Not in browser environment');
      return;
    }
    
    console.log('=== Cookie Debug Info ===');
    console.log('All cookies:', document.cookie);
    
    const cacheCookie = document.cookie
      .split(';')
      .find(cookie => cookie.trim().startsWith('multi-tenant-cache='));
    
    if (cacheCookie) {
      const value = decodeURIComponent(cacheCookie.split('=')[1]);
      console.log('Cache cookie value:', value);
      try {
        const parsed = JSON.parse(value);
        console.log('Parsed cache data:', parsed);
        console.log('Active session:', parsed.activeSession);
        console.log('User sessions count:', parsed.userSessions ? parsed.userSessions.length : 0);
      } catch (parseError) {
        console.log('Failed to parse cache cookie:', parseError);
      }
    } else {
      console.log('No cache cookie found');
    }
    console.log('=== End Cookie Debug ===');
  } catch (error) {
    console.error('Error reading cookies:', error);
  }
};

// Utility to manually restore session from cookies
export const manualRestoreSession = (): boolean => {
  try {
    if (typeof document === 'undefined') return false;
    
    const cacheCookie = document.cookie
      .split(';')
      .find(cookie => cookie.trim().startsWith('multi-tenant-cache='));
    
    if (cacheCookie) {
      const value = decodeURIComponent(cacheCookie.split('=')[1]);
      const parsed = JSON.parse(value);
      
      if (parsed.userSessions && Array.isArray(parsed.userSessions) && parsed.userSessions.length > 0) {
        // Convert userSessions back to Map
        const userSessions = new Map();
        parsed.userSessions.forEach(([key, value]: [string, UserSession]) => {
          userSessions.set(key, value);
        });
        
        // Find most recent session
        const sessions = Array.from(userSessions.values());
        const mostRecent = sessions.reduce((latest, current) => 
          current.lastActive > latest.lastActive ? current : latest
        );
        
        // Set as active session
        useCacheStore.getState().setActiveSession(mostRecent);
        console.log('Manually restored session:', mostRecent.username);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error in manual restore:', error);
    return false;
  }
};

// These functions are now centralized in cacheManager.ts
// Use the centralized versions instead
