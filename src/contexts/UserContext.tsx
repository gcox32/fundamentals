'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '@/amplify/data/resource';
import { getCurrentUser } from 'aws-amplify/auth';

const client = generateClient<Schema>();

type User = Schema['User'];

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  error: null
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await getCurrentUser();
        
        // First, get all users to see what's available
        const allUsersResult = await client.models.User.list({
          authMode: 'userPool'
        });
        console.log('allUsersResult', allUsersResult);
        // Find the user in our database using their Cognito sub
        const userResult = await client.models.User.list({
          filter: { sub: { eq: currentUser.username } },
          authMode: 'userPool'
        });
        console.log('userResult', userResult);
        const user = userResult.data?.[0];
        if (!user) {
          throw new Error('User not found in database');
        }

        setUser(user as unknown as User);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user information');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, error }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 