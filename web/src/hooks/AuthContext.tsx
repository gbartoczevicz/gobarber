import React, { createContext, useCallback, useState, useContext } from 'react';

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
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@gobarber/token');
    const user = localStorage.getItem('@gobarber/user');

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }: Credentials) => {
    const res = await client.post('/sessions', {
      email,
      password,
    });

    const { token, user } = res.data;

    localStorage.setItem('@gobarber/token', token);
    localStorage.setItem('@gobarber/user', JSON.stringify(user));

    setData({ token, user });
  }, []);

  const signOut = useCallback((): void => {
    localStorage.removeItem('@gobarber/token');
    localStorage.removeItem('@gobarber/user');

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
