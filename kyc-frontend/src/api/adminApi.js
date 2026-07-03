import apiClient from './httpClient.js'

export function createStaffUser(payload) {
  return apiClient.post('/api/admin/users', payload).then((response) => response.data)
}

export function getAdminUsers(role) {
  const params = role ? { role } : undefined
  return apiClient.get('/api/admin/users', { params }).then((response) => response.data)
}

export function activateUser(id) {
  return apiClient.patch(`/api/admin/users/${id}/activate`).then((response) => response.data)
}

export function deactivateUser(id) {
  return apiClient.patch(`/api/admin/users/${id}/deactivate`).then((response) => response.data)
}

export function getAllKycForAdmin() {
  return apiClient.get('/api/admin/kyc').then((response) => response.data)
}

export function getAdminDashboard() {
  return apiClient.get('/api/admin/dashboard').then((response) => response.data)
}

export function getAdminAudit(id) {
  return apiClient.get(`/api/admin/kyc/${id}/audit`).then((response) => response.data)
}

export function createMapping(payload) {
  return apiClient.post('/api/admin/mappings', payload).then((response) => response.data)
}

export function updateMapping(id, payload) {
  return apiClient.put(`/api/admin/mappings/${id}`, payload).then((response) => response.data)
}

export function getMappings() {
  return apiClient.get('/api/admin/mappings').then((response) => response.data)
}

export function deleteMapping(id) {
  return apiClient.delete(`/api/admin/mappings/${id}`).then((response) => response.data)
}
