import React, { useState } from 'react';
import { useAuthenticator } from '@/src/hooks/useAuthenticator';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import './styles.css';

type AuthState = 'signIn' | 'signUp' | 'forgotPassword';

interface AuthenticatorProps {
  initialState?: AuthState;
  hideSignUp?: boolean;
}

export function Authenticator({ initialState = 'signIn', hideSignUp = false }: AuthenticatorProps) {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const { signIn } = useAuthenticator();

  const handleStateChange = (newState: string) => {
    setAuthState(newState as AuthState);
  };

  const renderForm = () => {
    switch (authState) {
      case 'signIn':
        return (
          <SignInForm 
            onStateChange={handleStateChange}
            hideSignUp={hideSignUp}
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