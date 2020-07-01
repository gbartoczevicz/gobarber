import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import client from '../services/client';

interface AuthState {
  token: string;
  user: object;
}

interface Credentials {
  email: string;
  password: string;
}

interface Context {
  user: object;
  signIn(c: Credentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<Context>({} as Context);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);

  useEffect(() => {
    async function loadStorage(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@gobarber/token',
        '@gobarber/user',
      ]);

      if (token[1] && user[1]) {
        setData({ token: token[1], user: JSON.parse(user[1]) });
      }
    }

    loadStorage();
  }, []);

  const signIn = useCallback(async ({ email, password }: Credentials) => {
    const res = await client.post('/sessions', {
      email,
      password,
    });

    const { token, user } = res.data;

    await AsyncStorage.multiSet([
      ['@gobarber/token', token],
      ['@gobarber/user', JSON.stringify(user)],
    ]);

    setData({ token, user });
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    await AsyncStorage.multiRemove(['@gobarber/token', '@gobarber/user']);

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): Context {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
