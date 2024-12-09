import { useState, useEffect, useCallback } from 'react';

interface User {
  username: string;
  email: string;
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authStatus: AuthStatus;
  signOut: () => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
}
export function useAuthenticator(selector?: (context: AuthContextType) => any) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for existing session/token in localStorage or cookies
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // In a real implementation, validate the token
          setAuthState({
            user: { username: 'demo', email: 'demo@example.com' },
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    checkAuth();
  }, []);

  const signOut = useCallback(async () => {
    // Clear auth token and state
    localStorage.removeItem('authToken');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  }, []);

  const signIn = useCallback(async (username: string, password: string) => {
    // Implement sign in logic here
    // For demo, just set a dummy token
    localStorage.setItem('authToken', 'dummy-token');
    setAuthState({
      user: { username, email: `${username}@example.com` },
      isAuthenticated: true,
      isLoading: false
    });
  }, []);

  const context: AuthContextType = {
    ...authState,
    signOut,
    signIn,
    authStatus: authState.isLoading ? 'loading' : authState.isAuthenticated ? 'authenticated' : 'unauthenticated'
  };

  // If selector is provided, return only selected values
  if (selector) {
    return selector(context);
  }

  return context;
} 