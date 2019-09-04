import React from 'react';

import AuthContext from './authContext';
import { AuthenticateFunc } from './useAuthContext';

export const authProvider: React.FC<{
  authenticate: AuthenticateFunc;
}> = ({ authenticate, children }) => {
  return (
    <AuthContext.Provider value={authenticate}>{children}</AuthContext.Provider>
  );
};
