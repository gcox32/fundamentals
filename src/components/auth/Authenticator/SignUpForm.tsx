import React, { useState } from 'react';
import { signUp } from 'aws-amplify/auth';
import { AuthError } from '@aws-amplify/auth';
import { Spinner } from '@/src/components/common/Spinner';

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
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);
    try {
      await signUp({
        username: formData.email,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
            preferred_username: formData.username
          },
          autoSignIn: true
        }
      });
      onStateChange('confirmSignUp');
    } catch (err) {
      if (err instanceof AuthError) {
        switch (err.name) {
          case 'UsernameExistsException':
            setError('An account with this email already exists');
            break;
          case 'InvalidPasswordException':
            setError('Password does not meet requirements');
            break;
          default:
            setError('Failed to create account');
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
      
      <div className="form-field">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
          disabled={isLoading}
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
          disabled={isLoading}
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
          disabled={isLoading}
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
            <span className="button-text">Creating Account...</span>
          </span>
        ) : (
          'Create Account'
        )}
      </button>

      <div className="auth-links">
        <button 
          type="button" 
          onClick={() => onStateChange('signIn')}
          className="text-button"
          disabled={isLoading}
        >
          Already have an account? Sign in
        </button>
      </div>
    </form>
  );
} 