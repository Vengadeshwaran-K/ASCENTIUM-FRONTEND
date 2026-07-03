import apiClient from './httpClient.js'

export function createKycDraft(payload) {
  return apiClient.post('/api/kyc', payload).then((response) => response.data)
}

export function updateKycDraft(id, payload) {
  return apiClient.put(`/api/kyc/${id}`, payload).then((response) => response.data)
}

export function submitKyc(id) {
  return apiClient.post(`/api/kyc/${id}/submit`, {}).then((response) => response.data)
}

export function getMyKycRequests() {
  return apiClient.get('/api/kyc/my').then((response) => response.data)
}

export function getKycById(id) {
  return apiClient.get(`/api/kyc/${id}`).then((response) => response.data)
}

export function getClientDashboard() {
  return apiClient.get('/api/kyc/dashboard').then((response) => response.data)
}
