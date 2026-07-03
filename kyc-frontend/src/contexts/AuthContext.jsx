/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setupInterceptors } from '../api/httpClient.js'

const AUTH_STORAGE_KEY = 'kyc-auth'

const defaultAuth = {
  token: null,
  role: null,
  userId: null,
  fullName: '',
  email: '',
}

const AuthContext = createContext({
  auth: defaultAuth,
  login: () => {},
  logout: () => {},
})

function readStoredAuth() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return defaultAuth
  try {
    const parsed = JSON.parse(raw)
    return { ...defaultAuth, ...parsed }
  } catch {
    return defaultAuth
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth)
  const navigate = useNavigate()

  useEffect(() => {
    setupInterceptors({
      getAuth: () => auth,
      handleUnauthorized: () => {
        setAuth(defaultAuth)
        localStorage.removeItem(AUTH_STORAGE_KEY)
        navigate('/login', { replace: true })
      },
      handleForbidden: () => {
        window.dispatchEvent(
          new CustomEvent('app:toast', {
            detail: { type: 'error', message: 'Not authorized for this action.' },
          }),
        )
      },
    })
  }, [auth, navigate])

  const value = useMemo(
    () => ({
      auth,
      login: (authResponse) => {
        const nextAuth = {
          token: authResponse?.token ?? null,
          role: authResponse?.role ?? null,
          userId: authResponse?.userId ?? null,
          fullName: authResponse?.fullName ?? '',
          email: authResponse?.email ?? '',
        }
        setAuth(nextAuth)
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth))
      },
      logout: () => {
        setAuth(defaultAuth)
        localStorage.removeItem(AUTH_STORAGE_KEY)
      },
    }),
    [auth],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
