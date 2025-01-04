'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '@/amplify/data/resource';
import { getCurrentUser } from 'aws-amplify/auth';

const client = generateClient<Schema>();

type User = Schema['User'];

interface UserContextType {
  user: (User & { profile?: { avatar?: string | null } }) | null;
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
        
        // Find the user in our database using their Cognito sub
        const userResult = await client.models.User.list({
          filter: { sub: { eq: currentUser.username } },
          authMode: 'userPool'
        }) as unknown as { data: User[] };
        
        const user = userResult.data?.[0] as any;
        if (!user) {
          throw new Error('User not found in database');
        }

        // Fetch the associated profile
        const profileResult = await client.models.Profile.list({
          filter: { userId: { eq: user.id } },
          authMode: 'userPool'
        });

        const profile = profileResult.data?.[0] as { avatar?: string | null };
        const userData = {
          ...user,
          profile
        };
        
        setUser(userData as UserContextType['user']);
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