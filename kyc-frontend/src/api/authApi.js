import apiClient from './httpClient.js'

export function registerClient(payload) {
  return apiClient.post('/api/auth/register', payload).then((response) => response.data)
}

export function login(payload) {
  return apiClient.post('/api/auth/login', payload).then((response) => response.data)
}
