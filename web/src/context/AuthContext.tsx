import React, { createContext, useCallback } from 'react';

import client from '../services/client';

interface Credentials {
  email: string;
  password: string;
}

interface Context {
  name: string;
  signIn(c: Credentials): Promise<void>;
}

export const AuthContext = createContext<Context>({} as Context);

export const AuthProvider: React.FC = ({ children }) => {
  const signIn = useCallback(async ({ email, password }) => {
    const res = await client.post('/sessions', {
      email,
      password,
    });

    console.log(res.data);
  }, []);

  return (
    <AuthContext.Provider value={{ name: 'Trau', signIn }}>
      {children}
    </AuthContext.Provider>
  );
};
