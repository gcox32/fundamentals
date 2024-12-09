import React, { useState } from 'react';

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
        // Simulate sending reset code
        setIsCodeSent(true);
      } else {
        // Simulate password reset
        console.log('Password reset with:', { email, code, newPassword });
        onStateChange('signIn');
      }
    } catch (err) {
      setError('Failed to process request');
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