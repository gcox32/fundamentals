import React, { useState } from 'react';
import { useAuthenticator } from '@/src/hooks/useAuthenticator';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import ConfirmSignUpForm from './ConfirmSignUpForm';
import ChangePasswordForm from './ChangePasswordForm';
import './styles.css';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from 'aws-amplify/auth';

type AuthState = 'signIn' | 'signUp' | 'forgotPassword' | 'confirmSignUp' | 'changePassword';

interface AuthenticatorProps {
  initialState?: AuthState;
  hideSignUp?: boolean;
  email?: string;
  nextUrl?: string;
}

export function Authenticator({ 
  initialState = 'signIn', 
  hideSignUp = false,
  email = '',
  nextUrl
}: AuthenticatorProps) {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const [userEmail, setUserEmail] = useState(email);
  const [username, setUsername] = useState('');
  const { signIn } = useAuthenticator();

  const handleStateChange = (newState: string, email?: string) => {
    if (email) setUserEmail(email);
    setAuthState(newState as AuthState);
  };

  const handleSignIn = async (username: string, password: string) => {
    try {
      // First check if user is already authenticated
      try {
        const currentUser = await getCurrentUser();
        // If we get here, user is already authenticated
        router.replace(nextUrl || '/');
        return;
      } catch {
        // User is not authenticated, proceed with sign in
        const result = await signIn(username, password);
        
        // Handle password change requirement
        if (result?.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
          router.push(`/auth/change-password?username=${encodeURIComponent(username)}`);
          return;
        }

        // Handle successful sign in
        if (result?.isSignedIn) {
          router.replace(nextUrl || '/');
          return;
        }
      }
    } catch (error: any) {
      if (error.name === 'NewPasswordRequiredException') {
        router.push(`/auth/change-password?username=${encodeURIComponent(username)}`);
        return;
      }
      if (error.name === 'UserAlreadyAuthenticatedException') {
        router.replace(nextUrl || '/');
        return;
      }
      throw error;
    }
  };

  const renderForm = () => {
    switch (authState) {
      case 'signIn':
        return (
          <SignInForm 
            onStateChange={handleStateChange}
            hideSignUp={hideSignUp}
            onSignIn={handleSignIn}
          />
        );
      case 'signUp':
        return (
          <SignUpForm 
            onStateChange={handleStateChange}
          />
        );
      case 'forgotPassword':
        return (
          <ForgotPasswordForm 
            onStateChange={handleStateChange}
          />
        );
      case 'confirmSignUp':
        return (
          <ConfirmSignUpForm 
            onStateChange={handleStateChange}
            email={userEmail}
          />
        );
      case 'changePassword':
        return (
          <ChangePasswordForm
            onStateChange={handleStateChange}
            username={username}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="authenticator-container" data-auth-state={authState}>
      {renderForm()}
    </div>
  );
} 