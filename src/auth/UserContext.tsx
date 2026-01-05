import { createContext, JSX, useContext, useEffect, useState } from 'react';
import { authService, UserData } from './auth.service';

interface UserContextType {
  userData: UserData | null;
  loading: boolean;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: JSX.Element }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const data = await authService.getUserData();
      setUserData(data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const refetchUser = async () => {
    setLoading(true);
    await fetchUserData();
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, loading, refetchUser }}>
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
