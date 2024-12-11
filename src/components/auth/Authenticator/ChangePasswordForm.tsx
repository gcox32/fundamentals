import React, { useState } from 'react';
import { useAuthenticator } from '@/src/hooks/useAuthenticator';
import { useRouter } from 'next/navigation';

interface ChangePasswordFormProps {
  onStateChange: (state: string) => void;
  username: string;
}

export default function ChangePasswordForm({ onStateChange, username }: ChangePasswordFormProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { confirmPasswordChange } = useAuthenticator();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const result = await confirmPasswordChange(username, newPassword);
      if (result?.isSignedIn) {
        router.replace('/'); // or wherever your protected route is
      }
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <div className="auth-error">{error}</div>}
      
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

      <div className="form-field">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="submit-button">
        Change Password
      </button>
    </form>
  );
} 