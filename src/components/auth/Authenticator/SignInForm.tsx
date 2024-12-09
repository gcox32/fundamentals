import React, { useState } from 'react';
import { useAuthenticator } from '@/src/hooks/useAuthenticator';

interface SignInFormProps {
  onStateChange: (state: string) => void;
  hideSignUp?: boolean;
}

export default function SignInForm({ onStateChange, hideSignUp }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuthenticator();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await signIn(email, password);
    } catch (err) {
      setError('Invalid email or password');
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
        />
      </div>

      <button type="submit" className="submit-button">
        Sign In
      </button>

      <div className="auth-links">
        <button 
          type="button" 
          onClick={() => onStateChange('forgotPassword')}
          className="text-button"
        >
          Forgot password?
        </button>
        
        {!hideSignUp && (
          <button 
            type="button" 
            onClick={() => onStateChange('signUp')}
            className="text-button"
          >
            Create account
          </button>
        )}
      </div>
    </form>
  );
}