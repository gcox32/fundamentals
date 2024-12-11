import React, { useState } from 'react';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { AuthError } from '@aws-amplify/auth';

interface ConfirmSignUpFormProps {
  onStateChange: (state: string) => void;
  email?: string;
}

export default function ConfirmSignUpForm({ onStateChange, email = '' }: ConfirmSignUpFormProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [userEmail, setUserEmail] = useState(email);
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleResendCode = async () => {
    try {
      await resendSignUpCode({ username: userEmail });
      setResendDisabled(true);
      setCountdown(30);
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      if (err instanceof AuthError) {
        setError('Failed to resend code. Please try again.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await confirmSignUp({
        username: userEmail,
        confirmationCode: verificationCode
      });
      onStateChange('signIn');
    } catch (err) {
      if (err instanceof AuthError) {
        switch (err.name) {
          case 'CodeMismatchException':
            setError('Invalid verification code');
            break;
          case 'ExpiredCodeException':
            setError('Verification code has expired');
            break;
          default:
            setError('Failed to verify account');
        }
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <div className="auth-error">{error}</div>}
      
      {!email && (
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />
        </div>
      )}

      <div className="form-field">
        <label htmlFor="code">Verification Code</label>
        <input
          id="code"
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="submit-button">
        Verify Account
      </button>

      <div className="auth-links">
        <button 
          type="button"
          onClick={handleResendCode}
          disabled={resendDisabled}
          className="text-button"
        >
          {resendDisabled 
            ? `Resend code in ${countdown}s` 
            : 'Resend code'}
        </button>
        <button 
          type="button" 
          onClick={() => onStateChange('signIn')}
          className="text-button"
        >
          Back to Sign In
        </button>
      </div>
    </form>
  );
} 