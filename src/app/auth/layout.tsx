'use client';

import './styles.css';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import AuthLoadingState from '@/components/auth/AuthLoadingState';

const BANNER_CONTENT = {
  '/auth/sign-in': {
    title: 'Welcome Back',
    description: 'Sign in to see the demo'
  },
  '/auth/sign-up': {
    title: 'Get Started',
    description: 'Create an account to begin measuring your athletic output'
  },
  '/auth/forgot-password': {
    title: 'Reset Password',
    description: 'We&apos;ll help you get back to the demo'
  },
  '/auth/confirm': {
    title: 'Confirm Account',
    description: 'Enter the confirmation code sent to your email'
  }
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const content = BANNER_CONTENT[pathname as keyof typeof BANNER_CONTENT] || {
    title: 'Output Score',
    description: 'A quantitative approach to measuring athletic performance through physics-based metrics'
  };

  return (
    <Suspense fallback={<AuthLoadingState />}> 
      <div className="auth-layout">
        <div className="auth-banner">
          <div className="banner-content">
            <h1>{content.title}</h1>
            <p>{content.description}</p>
          </div>
        </div>
        <div className="auth-content">
          {children}
        </div>
      </div>
    </Suspense>
  );
} 