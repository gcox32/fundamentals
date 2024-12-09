import React, { useState } from 'react';
import { useAuthenticator } from '@/src/hooks/useAuthenticator';

interface SignUpFormProps {
  onStateChange: (state: string) => void;
}

export default function SignUpForm({ onStateChange }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });
  const [error, setError] = useState('');
  const { signIn } = useAuthenticator();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // In a real implementation, this would be signUp instead of signIn
      await signIn(formData.email, formData.password);
    } catch (err) {
      setError('Failed to create account');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <div className="auth-error">{error}</div>}
      
      <div className="form-field">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="submit-button">
        Create Account
      </button>

      <div className="auth-links">
        <button 
          type="button" 
          onClick={() => onStateChange('signIn')}
          className="text-button"
        >
          Already have an account? Sign in
        </button>
      </div>
    </form>
  );
} 