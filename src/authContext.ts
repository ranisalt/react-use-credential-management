import { createContext } from 'react';

import { AuthenticateFunc } from './useAuthContext';

const authContext = createContext<AuthenticateFunc>(async () => {
  throw new Error('authenticate() has been called before being set');
});

export default authContext;
