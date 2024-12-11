import React, { useState } from 'react';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { AuthError } from '@aws-amplify/auth';

interface ForgotPasswordFormProps {
  onStateChange: (state: string) => void;
}

export default function ForgotPasswordForm({ onStateChange }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (!isCodeSent) {
        await resetPassword({ username: email });
        setIsCodeSent(true);
      } else {
        await confirmResetPassword({
          username: email,
          confirmationCode: code,
          newPassword
        });
        onStateChange('signIn');
      }
    } catch (err) {
      if (err instanceof AuthError) {
        switch (err.name) {
          case 'LimitExceededException':
            setError('Too many attempts. Please try again later.');
            break;
          case 'CodeMismatchException':
            setError('Invalid verification code');
            break;
          case 'InvalidPasswordException':
            setError('Password does not meet requirements');
            break;
          case 'UserNotFoundException':
            setError('No account found with this email');
            break;
          default:
            setError('An error occurred during password reset');
        }
      } else {
        setError('An unexpected error occurred');
      }
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
          disabled={isCodeSent}
        />
      </div>

      {isCodeSent && (
        <>
          <div className="form-field">
            <label htmlFor="code">Verification Code</label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
        </>
      )}

      <button type="submit" className="submit-button">
        {isCodeSent ? 'Reset Password' : 'Send Code'}
      </button>

      <div className="auth-links">
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