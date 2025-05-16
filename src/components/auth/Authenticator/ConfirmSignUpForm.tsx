import React, { useState } from 'react';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { AuthError } from '@aws-amplify/auth';
import { Spinner } from '@/src/components/common/Spinner';

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
  const [isLoading, setIsLoading] = useState(false);

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
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
            <span className="button-text">Verifying...</span>
          </span>
        ) : (
          'Verify Account'
        )}
      </button>

      <div className="auth-links">
        <button 
          type="button"
          onClick={handleResendCode}
          disabled={resendDisabled || isLoading}
          className="text-button"
        >
          {resendDisabled 
            ? `Resend code in ${countdown}s` 
            : isLoading 
              ? <span className="button-content">
                  <Spinner size="small" color="currentColor" />
                  <span className="button-text">Resending...</span>
                </span>
              : 'Resend code'}
        </button>
        <button 
          type="button" 
          onClick={() => onStateChange('signIn')}
          className="text-button"
          disabled={isLoading}
        >
          Back to Sign In
        </button>
      </div>
    </form>
  );
} 