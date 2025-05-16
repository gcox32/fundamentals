import React, { useState } from 'react';
import { useAuthenticator } from '@/src/hooks/useAuthenticator';
import { AuthError } from '@aws-amplify/auth';
import { Spinner } from '@/src/components/common/Spinner';

interface SignInFormProps {
  onStateChange: (state: string) => void;
  hideSignUp?: boolean;
  onSignIn: (username: string, password: string) => Promise<void>;
}

export default function SignInForm({ onStateChange, hideSignUp, onSignIn }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await onSignIn(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <div className="auth-error">{error}</div>}
      
      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="form-field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <button 
        type="submit" 
        className="submit-button"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="button-content">
            <Spinner size="small" color="white" />
            <span className="button-text">Signing In...</span>
          </span>
        ) : (
          'Sign In'
        )}
      </button>

      <div className="auth-links">
        <button 
          type="button" 
          onClick={() => onStateChange('forgotPassword')}
          className="text-button"
          disabled={isLoading}
        >
          Forgot password?
        </button>
        
        {!hideSignUp && (
          <button 
            type="button" 
            onClick={() => onStateChange('signUp')}
            className="text-button"
            disabled={isLoading}
          >
            Create account
          </button>
        )}
      </div>
    </form>
  );
}