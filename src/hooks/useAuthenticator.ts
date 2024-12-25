import { getCurrentUser, signIn as amplifySignIn, signOut as amplifySignOut, confirmSignIn } from 'aws-amplify/auth';
import { useState, useEffect, useCallback } from 'react';
import { Hub } from 'aws-amplify/utils';
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';

Amplify.configure(outputs);

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
  signIn: (username: string, password: string) => Promise<any>;
  confirmPasswordChange: (username: string, newPassword: string) => Promise<any>;
}

export function useAuthenticator(selector?: (context: AuthContextType) => any) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setAuthState({
          user: {
            username: user.username,
            email: user.signInDetails?.loginId || ''
          },
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        console.log('No authenticated user found:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    checkAuth();

    const hubListener = Hub.listen('auth', ({ payload }) => {
      console.log('Auth Hub event:', payload);
      switch (payload.event) {
        case 'signedIn':
          checkAuth();
          break;
        case 'signedOut':
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
          break;
        case 'tokenRefresh':
          console.log('Token refreshed');
          break;
        case 'tokenRefresh_failure':
          console.log('Token refresh failed');
          break;
      }
    });

    return () => hubListener();
  }, []);

  const signIn = useCallback(async (username: string, password: string) => {
    try {
      const signInResult = await amplifySignIn({ username, password });
      
      if (signInResult.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        console.log('User needs to change password');
        return signInResult;
      }
      
      const user = await getCurrentUser();
      
      setAuthState({
        user: {
          username: user.username,
          email: user.signInDetails?.loginId || ''
        },
        isAuthenticated: true,
        isLoading: false
      });

      return signInResult;
    } catch (error: any) {
      console.error('Sign in error:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await amplifySignOut();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  const confirmPasswordChange = useCallback(async (username: string, newPassword: string) => {
    try {
      // Confirm the sign in with the new password
      const result = await confirmSignIn({ challengeResponse: newPassword });
      
      // After successful password change, get the current user
      const user = await getCurrentUser();
      setAuthState({
        user: {
          username: user.username,
          email: user.signInDetails?.loginId || ''
        },
        isAuthenticated: true,
        isLoading: false
      });

      return result;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }, []);

  const context: AuthContextType = {
    ...authState,
    signOut,
    signIn,
    confirmPasswordChange,
    authStatus: authState.isLoading ? 'loading' : authState.isAuthenticated ? 'authenticated' : 'unauthenticated'
  };

  if (selector) {
    return selector(context);
  }

  return context;
} 