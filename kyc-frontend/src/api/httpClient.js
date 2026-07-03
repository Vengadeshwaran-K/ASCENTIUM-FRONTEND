import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
})

let onUnauthorized = null
let onForbidden = null
let getAuthState = () => ({ token: null, role: null })

export function setupInterceptors({ getAuth, handleUnauthorized, handleForbidden }) {
  getAuthState = getAuth
  onUnauthorized = handleUnauthorized
  onForbidden = handleForbidden
}

apiClient.interceptors.request.use((config) => {
  const requestConfig = { ...config }
  const url = requestConfig.url ?? ''
  const baseURL = requestConfig.baseURL ?? ''

  if (baseURL.endsWith('/api') && url.startsWith('/api/')) {
    requestConfig.url = url.replace('/api/', '/')
  }

  const effectiveUrl = requestConfig.url ?? url
  if (effectiveUrl.startsWith('/api/auth/') || effectiveUrl.startsWith('/auth/')) {
    return requestConfig
  }

  const { token, role } = getAuthState()

  if (token) {
    requestConfig.headers = requestConfig.headers ?? {}
    requestConfig.headers.Authorization = `Bearer ${token}`
  }

  if (role) {
    requestConfig.headers = requestConfig.headers ?? {}
    requestConfig.headers['X-User-Role'] = role
  }

  requestConfig.headers = requestConfig.headers ?? {}
  requestConfig.headers['Content-Type'] = 'application/json'

  return requestConfig
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401 && onUnauthorized) {
      onUnauthorized()
    } else if (status === 403 && onForbidden) {
      onForbidden()
    }
    return Promise.reject(error)
  },
)

export default apiClient
