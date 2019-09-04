import { useState, useCallback, useEffect } from 'react'

import useAuthContext from './useAuthContext'

const useCredentialManagement = () => {
  const authenticate = useAuthContext()
  const [isAuthenticated, setAuthenticated] = useState(false)
  const [isLoading, setLoading] = useState(true)

  const wrapAuthenticate = useCallback(
    async (credential: PasswordCredentialData) => {
      setLoading(true)
      try {
        return authenticate(credential)
      } finally {
        setLoading(false)
      }
    },
    [authenticate]
  )

  const login = useCallback(
    async mediation => {
      const credential = await navigator.credentials.get({
        password: true,
        mediation,
      })

      if (credential == null) {
        return false
      } else if (credential.type === 'password') {
        await wrapAuthenticate(credential as PasswordCredentialData)
        setAuthenticated(true)
        return true
      }
      return false
    },
    [wrapAuthenticate]
  )

  const signup = useCallback(
    async (id: Readonly<string>, password: Readonly<string>) => {
      const credential = await navigator.credentials.create({
        password: await wrapAuthenticate({ id, password }),
      })
      if (!credential) {
        return
      }

      await navigator.credentials.store(credential)
      setAuthenticated(true)
    },
    [wrapAuthenticate]
  )

  const logout = useCallback(async () => {
    setAuthenticated(false)
    await navigator.credentials.preventSilentAccess()
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      login('silent')
    }
  }, [isAuthenticated, login])

  return { isAuthenticated, isLoading, login, logout, signup }
}

export default useCredentialManagement
