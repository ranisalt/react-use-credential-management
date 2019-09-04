import { useContext } from 'react';

import AuthContext from './authContext';

export type AuthenticateFunc = (
  fields: Readonly<PasswordCredentialData>
) => Promise<PasswordCredentialData>;

const useAuthContext = () => useContext(AuthContext);

export default useAuthContext;
